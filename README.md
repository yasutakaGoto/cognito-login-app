# cognito-login-app
1. usename=メールアドレスでSing up
2. メールで送られてきた認証コードを入力し、Confirm
3. Sing in（ユーザーセッションの確立）
4. Get Userでユーザー情報を取得
5. Attr nameに属性プロパティ名、valueに値を入力し、Update Attrするとユーザー情報を更新（追加）する  
・例: Attr name="gender" val="男性"  
・※カスタム属性の場合、"custom:"がprefixとして必要  
・例: Attr Name="custom:employee_type" val="正社員"  
・標準属性一覧：https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/user-pool-settings-attributes.html  
