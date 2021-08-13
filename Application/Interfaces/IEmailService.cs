using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEmailService
    {
        /// <summary>Create and send forgot password email</summary>
        /// <param name="recepient">Recepient email address</param>
        Task ForgotPassword(
            string recepient,
            Dictionary<string, string> parameters);

        /// <summary>Send email asyncronosly</summary>
        /// <param name="recepients">Recepient email addresses separated by comma</param>
        /// <param name="subject">Subject of email message</param>
        /// <param name="body">Content of email message</param>
        Task SendEmailAsync(
            string recepients,
            string subject,
            string body);
    }
}