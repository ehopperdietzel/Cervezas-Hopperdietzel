export var environment = 
{
  production: true,
  apiURL: 'http://146.83.216.218:8004/api',
  user:
  {
    id:-1,
    token: "",
    name:""
  }
};


export var decode = function(input:string)
{
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4;
    if(pad) {
      if(pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      input += new Array(5-pad).join('=');
    }

    return atob(input);
}