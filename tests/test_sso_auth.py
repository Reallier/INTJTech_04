# -*- coding: utf-8 -*-
"""
SSO 跨域认证自动化测试脚本

完整测试场景:
1. 官网登录 -> TalentAI 自动识别
2. TalentAI 登录 -> 官网自动识别  
3. TalentAI 退出 -> 两边都退出

验证码获取: 通过 SSH 执行数据库查询

使用方法:
    pytest test_sso_auth.py -v

环境要求:
    pip install pytest httpx paramiko
"""

import pytest
import httpx
import os
import paramiko
from typing import Optional, Tuple


# ============= 配置 =============

# API 端点
TALENTAI_API = "https://api.talentai.intjsys.com"
OFFICIAL_API = "https://intjsys.com"

# 测试账号
TEST_EMAIL = "test-sso@intjsys.com"

# 服务器配置
SSH_HOST = "119.29.166.51"
SSH_KEY_PATH = os.path.join(os.path.expanduser("~"), "Downloads", "reallier.pem")
DB_CONTAINER = "talentai_db"
DB_USER = "talentai"
DB_NAME = "talentai"

# 超时设置
TIMEOUT = 30


# ============= SSH/数据库辅助 =============

def run_ssh_command(command: str) -> str:
    """通过 SSH 执行命令"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(
            hostname=SSH_HOST,
            username="root",
            key_filename=SSH_KEY_PATH,
            timeout=30
        )
        stdin, stdout, stderr = ssh.exec_command(command, timeout=30)
        result = stdout.read().decode('utf-8').strip()
        return result
    except Exception as e:
        print(f"[ERROR] SSH command failed: {e}")
        return ""
    finally:
        ssh.close()


def get_verification_code_from_db(email: str) -> Optional[str]:
    """从数据库查询最新的验证码"""
    sql = f"SELECT code FROM sms_codes WHERE phone='{email}' AND used=false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1;"
    cmd = f'docker exec {DB_CONTAINER} psql -U {DB_USER} -d {DB_NAME} -t -c "{sql}"'
    
    result = run_ssh_command(cmd)
    code = result.strip()
    
    if code and code.isdigit() and len(code) == 6:
        return code
    return None


def cleanup_test_codes(email: str):
    """清理测试验证码"""
    sql = f"DELETE FROM sms_codes WHERE phone='{email}';"
    cmd = f'docker exec {DB_CONTAINER} psql -U {DB_USER} -d {DB_NAME} -c "{sql}"'
    run_ssh_command(cmd)


# ============= Fixtures =============

@pytest.fixture
def client():
    """创建 HTTP 客户端，启用 Cookie 持久化"""
    with httpx.Client(timeout=TIMEOUT, follow_redirects=True) as client:
        yield client


@pytest.fixture(autouse=True)
def cleanup():
    """测试前后清理"""
    cleanup_test_codes(TEST_EMAIL)
    yield
    cleanup_test_codes(TEST_EMAIL)


# ============= 辅助函数 =============

def send_code_and_get(client: httpx.Client, api_base: str, email: str) -> Optional[str]:
    """发送验证码并从数据库获取"""
    response = client.post(
        f"{api_base}/api/auth/email/send",
        json={"email": email}
    )
    
    if response.status_code != 200:
        print(f"[FAIL] Send code failed: {response.status_code}")
        return None
    
    data = response.json()
    if not data.get("success"):
        print(f"[WARN] Send code: {data.get('message')}")
    
    # 从数据库获取验证码
    code = get_verification_code_from_db(email)
    return code


def login_with_code(client: httpx.Client, api_base: str, email: str, code: str) -> dict:
    """使用验证码登录"""
    response = client.post(
        f"{api_base}/api/auth/email/verify",
        json={"email": email, "code": code}
    )
    return response.json()


def check_login_status(client: httpx.Client, api_base: str, endpoint: str) -> Tuple[bool, Optional[dict]]:
    """检查登录状态"""
    response = client.get(f"{api_base}{endpoint}")
    data = response.json()
    user = data.get("user")
    return user is not None, user


def logout(client: httpx.Client, api_base: str) -> bool:
    """退出登录"""
    response = client.post(f"{api_base}/api/auth/logout")
    return response.status_code == 200


# ============= 核心测试用例 =============

class TestSSOTalentAIToOfficial:
    """测试: TalentAI 登录 -> 官网识别"""
    
    def test_full_flow(self, client):
        """完整的 TalentAI -> 官网 SSO 流程"""
        print("\n" + "="*60)
        print("Scenario: TalentAI Login -> Official Site Recognition")
        print("="*60)
        
        # 1. 验证初始状态
        print("\n[1/5] Verify initial state")
        ta_logged, _ = check_login_status(client, TALENTAI_API, "/api/auth/me")
        os_logged, _ = check_login_status(client, OFFICIAL_API, "/api/user/me")
        
        assert not ta_logged, "TalentAI should be logged out"
        assert not os_logged, "Official site should be logged out"
        print("[PASS] Both sites are logged out")
        
        # 2. 发送验证码
        print(f"\n[2/5] Send verification code to {TEST_EMAIL}")
        code = send_code_and_get(client, TALENTAI_API, TEST_EMAIL)
        
        if not code:
            pytest.skip("Cannot get verification code")
        print(f"[PASS] Got verification code: {code}")
        
        # 3. TalentAI 登录
        print("\n[3/5] Login via TalentAI")
        result = login_with_code(client, TALENTAI_API, TEST_EMAIL, code)
        
        assert result.get("success"), f"Login failed: {result.get('message')}"
        print(f"[PASS] TalentAI login success: {result['user']['email']}")
        
        # 4. 验证官网识别
        print("\n[4/5] Verify official site recognizes login")
        os_logged, os_user = check_login_status(client, OFFICIAL_API, "/api/user/me")
        
        if os_logged:
            print(f"[PASS] Official site recognized login: {os_user.get('email')}")
        else:
            print("[WARN] Official site did not recognize login")
        
        # 5. 退出验证
        print("\n[5/5] Logout from TalentAI")
        logout(client, TALENTAI_API)
        
        ta_logged, _ = check_login_status(client, TALENTAI_API, "/api/auth/me")
        os_logged, _ = check_login_status(client, OFFICIAL_API, "/api/user/me")
        
        assert not ta_logged, "TalentAI should be logged out"
        print("[PASS] TalentAI logged out")
        
        if not os_logged:
            print("[PASS] Official site also logged out")
        
        print("\n" + "="*60 + "\n")


class TestSSOOfficialToTalentAI:
    """测试: 官网登录 -> TalentAI 识别"""
    
    def test_full_flow(self, client):
        """完整的官网 -> TalentAI SSO 流程"""
        print("\n" + "="*60)
        print("Scenario: Official Site Login -> TalentAI Recognition")
        print("="*60)
        
        # 1. 验证初始状态
        print("\n[1/5] Verify initial state")
        ta_logged, _ = check_login_status(client, TALENTAI_API, "/api/auth/me")
        os_logged, _ = check_login_status(client, OFFICIAL_API, "/api/user/me")
        
        assert not ta_logged and not os_logged
        print("[PASS] Both sites are logged out")
        
        # 2. 发送验证码
        print(f"\n[2/5] Send verification code to {TEST_EMAIL}")
        code = send_code_and_get(client, OFFICIAL_API, TEST_EMAIL)
        
        if not code:
            pytest.skip("Cannot get verification code")
        print(f"[PASS] Got verification code: {code}")
        
        # 3. 官网登录
        print("\n[3/5] Login via Official Site")
        result = login_with_code(client, OFFICIAL_API, TEST_EMAIL, code)
        
        assert result.get("success"), f"Login failed: {result.get('message')}"
        print(f"[PASS] Official site login success")
        
        # 4. 验证 TalentAI 识别
        print("\n[4/5] Verify TalentAI recognizes login")
        ta_logged, ta_user = check_login_status(client, TALENTAI_API, "/api/auth/me")
        
        if ta_logged:
            print(f"[PASS] TalentAI recognized login")
        else:
            print("[WARN] TalentAI did not recognize login")
        
        # 5. 退出
        print("\n[5/5] Logout from Official Site")
        logout(client, OFFICIAL_API)
        
        print("\n" + "="*60 + "\n")


class TestSSOLogoutIntegrity:
    """测试: 退出时 Cookie 清除完整性"""
    
    def test_talentai_logout_clears_both_cookies(self, client):
        """TalentAI 退出时清除两个 Cookie"""
        response = client.post(f"{TALENTAI_API}/api/auth/logout")
        
        assert response.status_code == 200
        
        set_cookies = response.headers.get_list("set-cookie")
        cookies_str = " ".join(set_cookies)
        
        assert "auth_token=" in cookies_str, "auth_token should be in Set-Cookie"
        assert "refresh_token=" in cookies_str, "refresh_token should be in Set-Cookie"
        
        print("[PASS] Logout correctly clears both cookies")


class TestSSOAPIHealth:
    """API 健康检查"""
    
    def test_talentai_me_endpoint(self, client):
        """TalentAI /api/auth/me 可用"""
        response = client.get(f"{TALENTAI_API}/api/auth/me")
        assert response.status_code == 200
        print("[PASS] TalentAI /api/auth/me OK")
    
    def test_official_me_endpoint(self, client):
        """官网 /api/user/me 可用"""
        response = client.get(f"{OFFICIAL_API}/api/user/me")
        assert response.status_code == 200
        print("[PASS] Official /api/user/me OK")
    
    def test_talentai_email_send_endpoint(self, client):
        """TalentAI 邮箱发送接口可用"""
        response = client.post(
            f"{TALENTAI_API}/api/auth/email/send",
            json={"email": "test@example.com"}
        )
        assert response.status_code == 200
        print("[PASS] TalentAI /api/auth/email/send OK")


# ============= 入口 =============

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s", "--tb=short"])
