using MercadoExpress.Application.Interface;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Tls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;

namespace MercadoExpress.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var smtpServer = _config["SmtpSettings:Server"]?.Trim();
            var smtpPortStr = _config["SmtpSettings:Port"]?.Trim() ?? "587";
            var smtpPort = int.Parse(smtpPortStr);
            var senderName = _config["SmtpSettings:SenderName"]?.Trim();
            var senderEmail = _config["SmtpSettings:SenderEmail"]?.Trim();
            var smtpPassword = _config["SmtpSettings:Password"]?.Trim();

            Console.WriteLine($"===> PROBANDO CONEXIÓN SMTP: Host='{smtpServer}', Port={smtpPort}, Sender='{senderEmail}'");
            // creacion del mail
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            // El cuerpo admita cod html para que quede estetico
            email.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };

            // Conexion fisica con los servidores de Google usando MailKit
            using var smtp = new SmtpClient();
            try
            {
                // conexion con el puerta 587
                await smtp.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                // autenticacin de password
                await smtp.AuthenticateAsync(senderEmail, smtpPassword);
                // Mandamos el correo
                await smtp.SendAsync(email);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error mandando el email:  {ex.Message}");
                throw;
            }
            finally
            {
                // Nos desconectamos limpiamente del hilo de red de google
                await smtp.DisconnectAsync(true);
            }


        }
    }
}
