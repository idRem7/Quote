using Microsoft.EntityFrameworkCore;

namespace QuoteBackend.Models {

    public partial class ForQuotesContext : DbContext {


        public ForQuotesContext() {
        }

        public ForQuotesContext(DbContextOptions<ForQuotesContext> options)
            : base(options) {
        }

      

        public virtual DbSet<Categories> Categories { get; set; }
        public virtual DbSet<Quotes> Quotes { get; set; }

       

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<Categories>(entity =>   {

                entity.HasKey(e => e.CategoryId);

                entity.Property(e => e.CategoryId).HasColumnName("Category_ID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

            });

            modelBuilder.Entity<Quotes>(entity =>  {

                entity.HasKey(e => e.QuoteId);

                entity.Property(e => e.QuoteId).HasColumnName("Quote_ID");

                entity.Property(e => e.Author).IsRequired();

                entity.Property(e => e.CategoryId).HasColumnName("Category_ID");

                entity.Property(e => e.CreateDate).HasColumnType("date");

                entity.Property(e => e.Text).IsRequired();

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Quotes)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK_Quotes_Categories");

            });
        }
    }
}
