let cognitoUser, password, username, _session;
const poolData = { 
    UserPoolId: '',
    ClientId : ''
};

//ユーザー登録
$('#login-button').on('click', () => {

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    password = $('#form_singin [name=password]').val()
    username = $('#form_singin [name=username]').val()

    var dataEmail = {
        Name : 'email',
        Value : username
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(dataEmail.Value, password, attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        console.log(result) 
        console.log('user name is ' + cognitoUser.getUsername());

    });
});

// コード認証
$('#confirm-button').on('click', () => {
   
    confirmCode = $('#form_code [name=code]').val()
    cognitoUser.confirmRegistration(confirmCode, true, (err, result) => {
        if (err) {
            return reject(err);
        }
        $("#form_code").append('<p>認証しました。</p>')
        console.log("認証しました")
    });
});

// Sig in（Cognito サービスとのユーザーセッションを確立）
$('#signin-button').on('click', () => {
    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            $("#signin-button").append('<p>サインインしました。</p>')
            console.log("サインイン")
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('idToken + ' + result.idToken.jwtToken);
        },
        onFailure: (err) => {
            alert(err);
        },
    });
});

// ユーザー情報をlocalstrageから取得
$('#getuser-button').on('click', ()=> {
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            console.log('session validity: ' + session.isValid());
            _session = session
            _session.user = cognitoUser
        });
    }
});

// ユーザー属性取得
$('#getUserattr-button').on('click', ()=> {
    _session.user.getUserAttributes(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        for (i = 0; i < result.length; i++) {
            console.log(result[i].getName() + '：' + result[i].getValue());
        }
    });
});

// ユーザー属性更新
$('#updateUserattr-button').on('click', ()=> {

    var attributeList = [];
    var attribute = {
        Name : $('#form_attr [name=attr]').val(),
        Value : $('#form_attr [name=attr_val]').val()
    };
    var attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
    attributeList.push(attribute);
    
    console.log(attributeList);
    
    _session.user.updateAttributes(attributeList, function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log("属性更新: ", result)
    });
});