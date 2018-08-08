using System;
using System.Collections.Generic;

namespace QuoteBackend.Models
{
    public partial class Categories
    {
        public Categories()
        {
            Quotes = new HashSet<Quotes>();
        }

        public int CategoryId { get; set; }
        public string Name { get; set; }

        public ICollection<Quotes> Quotes { get; set; }
    }
}
