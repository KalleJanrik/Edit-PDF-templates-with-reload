using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using webapi.Controllers;

namespace webapi
{


public class PdfContext : DbContext
    {
        public DbSet<PdfTemplate> PdfTemplates { get; set; }

        // Other DbSets and configurations

        public PdfContext(DbContextOptions<PdfContext> options)
            : base(options)
        { }
    }

}
