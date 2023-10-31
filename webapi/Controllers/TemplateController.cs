using iText.Html2pdf;
using iText.Kernel.Pdf;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/templates")]
    public class TemplateController : ControllerBase
    {
        private readonly PdfContext dbContext;  // Declare an instance of your DbContext

        public TemplateController(PdfContext dbContext)  // Inject the DbContext into the constructor
        {
            this.dbContext = dbContext;  // Initialize the DbContext
        }

        [HttpGet]
        public ActionResult<IEnumerable<PdfTemplate>> GetAll()
        {
            return dbContext.PdfTemplates.ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<PdfTemplate> Get(int id)
        {
            var template = dbContext.PdfTemplates.Find(id);
            if (template == null)
            {
                return NotFound();
            }
            return template;
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, PdfTemplate updatedTemplate)
        {
            var template = dbContext.PdfTemplates.Find(id);
            if (template == null)
            {
                return NotFound();
            }

            template.HtmlContent = updatedTemplate.HtmlContent;
            template.LastModified = DateTime.Now;

            dbContext.SaveChanges();
            return NoContent();
        }

        [HttpPost("generate-pdf")]
        public IActionResult GeneratePDF([FromBody] TemplateModel template)
        {
            var stream = new MemoryStream();
            var writer = new PdfWriter(stream);
            var pdf = new PdfDocument(writer);

            // Convert HTML to PDF
            ConverterProperties properties = new ConverterProperties();
            HtmlConverter.ConvertToPdf(template.HtmlContent, pdf, properties);

            writer.Close();

            var newStream = new MemoryStream(stream.ToArray());

            return File(newStream, "application/pdf", "GeneratedTemplate.pdf");
        }
    }

    public class TemplateModel
    {
        public string HtmlContent { get; set; }
    }

}
