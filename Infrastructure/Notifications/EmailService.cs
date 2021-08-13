using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Options;

namespace Infrastructure.Notifications
{
    public class EmailService : IEmailService
    {
        private EmailServiceSettings _config;

        public EmailService(IOptions<EmailServiceSettings> config)
        {
            _config = config.Value;
        }

        public async Task ForgotPassword(
            string recepient,
            Dictionary<string, string> parameters)
        {
            var subject = "Reactivities - Password reset";
            var body = this.FillTemplate("<!DOCTYPE html> <html> <body> <table style=\"width:100%\"> <tr> <td style=\"background-color: #182a73; padding-top: 1em; padding-bottom: 1em; padding-left: 1em;\"> <span style=\"font-size: 2em; color: #ffffff; font: 2em Arial;\">Reactivities</span> </td> </tr> <tr> <td style=\"padding-top: 1em; padding-bottom: 1em; padding-left: 1em; font: 1em Arial;\">Hi, {Name}</td> </tr> <tr> <td style=\"padding-left: 1em; font: 1em Arial;\"> Someone, requested a password reset for your account in Reactivities. </td> </tr> <tr> <td style=\"padding-left: 1em; font: 1em Arial;\"> If it was you, please follow <a href=\"{Url}\" style=\"color: inherit;\" target=\"_blank\">this link</a> to complete the process. </td> </tr> <tr> <td style=\"padding-left: 1em; font: 1em Arial;\">Otherwise, ignore this email.</td> </tr> </table> </body> </html>", parameters);

            await this.SendEmailAsync(recepient, subject, body);
        }

        public async Task SendEmailAsync(
            string recepients,
            string subject,
            string body)
        {
            MailMessage message = new MailMessage()
            {
                From = new MailAddress(_config.Sender),
                Subject = subject,
                IsBodyHtml = true,
                Body = body
            };
            
            foreach (var recepient in recepients.Split(','))
            {
                message.To.Add(recepient);
            }

            var smtpClient = new SmtpClient(_config.ServerName)
            {
                Port = _config.Port,
                Credentials = new NetworkCredential(_config.AccountName, _config.AccountPass),
                EnableSsl = _config.EnableSsl
            };

            await smtpClient.SendMailAsync(message);
        }

        private string FillTemplate(string template, Dictionary<string, string> parameters)
        {
            foreach (var parameter in parameters)
            {
                template = template.Replace(parameter.Key, parameter.Value);
            }

            return template;
        }
    }
}