namespace Infrastructure.Notifications
{
    public class EmailServiceSettings
    {
        public string AccountName { get; set; }

        public string AccountPass { get; set; }

        public bool EnableSsl { get; set; }

        public int Port { get; set; }

        public string ServerName { get; set; }

        public string Sender { get; set; }
    }
}