namespace webapi.Controllers
{
    public class PdfTemplate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string HtmlContent { get; set; }
        public DateTime LastModified { get; set; }
        public DateTime Created { get; set; }
    }

}
