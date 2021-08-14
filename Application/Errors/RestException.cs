using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public RestException(HttpStatusCode code)
        {
            Error = string.Empty;
            Code = code;
        }

        public RestException(HttpStatusCode code, string error)
        {
            Error = error;
            Code = code;
        }

        public HttpStatusCode Code { get; set; }

        public string Error { get; set; }
    }
}