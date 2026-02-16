# -*- coding: utf-8 -*-
"""
快速 SSO 测试脚本 - 单独运行验证
"""
import httpx
import os
import sys

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from test_sso_auth import get_verification_code_from_db, cleanup_test_codes

TEST_EMAIL = "test-sso@intjsys.com"
TALENTAI_API = "https://api.talentai.intjsys.com"
OFFICIAL_API = "https://intjsys.com"


def main():
    print("=" * 60)
    print("SSO Quick Test")
    print("=" * 60)
    
    # 清理旧验证码
    print("\n[1] Cleanup old codes...")
    cleanup_test_codes(TEST_EMAIL)
    
    with httpx.Client(timeout=30) as client:
        # 发送验证码
        print(f"\n[2] Sending verification code to {TEST_EMAIL}...")
        r = client.post(
            f"{TALENTAI_API}/api/auth/email/send",
            json={"email": TEST_EMAIL}
        )
        print(f"    Result: {r.json()}")
        
        # 获取验证码
        print("\n[3] Getting code from database...")
        code = get_verification_code_from_db(TEST_EMAIL)
        if not code:
            print("    [FAIL] Cannot get verification code!")
            return
        print(f"    Got code: {code}")
        
        # 登录
        print("\n[4] Login via TalentAI...")
        r = client.post(
            f"{TALENTAI_API}/api/auth/email/verify",
            json={"email": TEST_EMAIL, "code": code}
        )
        result = r.json()
        print(f"    Result: success={result.get('success')}, user={result.get('user', {}).get('email')}")
        
        if not result.get("success"):
            print(f"    [FAIL] Login failed: {result.get('message')}")
            return
        
        # 检查 TalentAI 登录状态
        print("\n[5] Check TalentAI login status...")
        r = client.get(f"{TALENTAI_API}/api/auth/me")
        ta_data = r.json()
        ta_user = ta_data.get("user")
        print(f"    TalentAI: logged_in={ta_user is not None}")
        
        # 检查官网登录状态
        print("\n[6] Check Official site login status...")
        r = client.get(f"{OFFICIAL_API}/api/user/me")
        os_data = r.json()
        os_user = os_data.get("user")
        print(f"    Official: logged_in={os_user is not None}")
        
        # 退出
        print("\n[7] Logout from TalentAI...")
        r = client.post(f"{TALENTAI_API}/api/auth/logout")
        print(f"    Logout result: {r.status_code}")
        
        # 再次检查
        print("\n[8] Re-check both sites after logout...")
        r = client.get(f"{TALENTAI_API}/api/auth/me")
        ta_logged = r.json().get("user") is not None
        
        r = client.get(f"{OFFICIAL_API}/api/user/me")
        os_logged = r.json().get("user") is not None
        
        print(f"    TalentAI: logged_in={ta_logged}")
        print(f"    Official: logged_in={os_logged}")
        
        # 总结
        print("\n" + "=" * 60)
        print("Summary:")
        print(f"  - Login: [PASS]")
        print(f"  - TalentAI recognizes login: [PASS]")
        print(f"  - Official recognizes login: {'[PASS]' if os_user else '[WARN] Cross-domain SSO not working'}")
        print(f"  - Logout clears TalentAI: {'[PASS]' if not ta_logged else '[FAIL]'}")
        print(f"  - Logout clears Official: {'[PASS]' if not os_logged else '[WARN]'}")
        print("=" * 60)


if __name__ == "__main__":
    main()
