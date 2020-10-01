# sc
SC Backend project Project

## Firebase commands

* npm install -g firebase-tools
* npm install firebase-functions@latest firebase-admin@latest --save
* firebase login
* firebase deploy --only functions "customerType"

## Http status
https://www.restapitutorial.com/httpstatuscodes.html
* 200 Ok
* 201 Created
* 202 Accepted
* 205 Reset Content
* 204 No Content
* 206 Partial Content
* 400 Bad Request
* 401 Unauthorized
* 404 Not Found
* 500 Internal Server Error

##End points
###Customer Type
{
    code: DIN;
    name: Dining;
    internal: true;
}




Sample Response
{
    status: {
        code: Success;
        no: 200 
    }
    message: {
        short: ''
        detail: '' 
    }
    data: {
        
    }
}
