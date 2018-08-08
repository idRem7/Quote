using System;
using System.Collections.Generic;

namespace QuoteBackend.Models
{
    public partial class Quotes
    {
        public int QuoteId { get; set; }
        public string Text { get; set; }
        public string Author { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? CategoryId { get; set; }

        public Categories Category { get; set; }
    }
}
