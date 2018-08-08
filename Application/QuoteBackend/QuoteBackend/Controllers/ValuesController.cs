using System.Linq;
using Microsoft.AspNetCore.Mvc;
using QuoteBackend.Models;
using Newtonsoft.Json;
using System;

namespace QuoteBackend.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase{

        private ForQuotesContext _dataBase;

        public ValuesController(ForQuotesContext dbContext) {

            _dataBase = dbContext;

        }

                    
        // GET api/values
        [HttpGet]
        public ActionResult<string> Get(){                  

            //Получить все цитаты и категории в JSON

            var loadQuotes = _dataBase.Quotes.Select(note => new {
                note.QuoteId,
                note.Text,
                note.Author,
                note.CategoryId,
                note.CreateDate,
                Category = note.Category.Name
            });

            var loadCategories = _dataBase.Categories.Select(note => new {
                note.CategoryId,
                note.Name
            });

            var serverAnswer = new {
                quotes = loadQuotes,
                categories = loadCategories
            };

            return JsonConvert.SerializeObject(serverAnswer);

        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id){

            //Получить текст цитаты по ID
            //Не используется, но приятно, что работает)

            var loadQuote = _dataBase.Quotes.Single(note => note.QuoteId == id);
            return loadQuote.Text;
          
        }
        
        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value){

            //Создать новую цитату
            //Данные содержатся в JSON

            //Распаковать JSON клиента
            //Запихать в бд

            var deserializeRequest = new {              
                Text = "",
                Author = "",
                CategoryId = -1,
                CreateDate = new DateTime()
            };
            deserializeRequest = JsonConvert.DeserializeAnonymousType(value, deserializeRequest);

            var newNode = new Quotes();
            newNode.Author = deserializeRequest.Author;
            newNode.CategoryId = deserializeRequest.CategoryId;
            newNode.CreateDate = deserializeRequest.CreateDate;
            newNode.Text = deserializeRequest.Text;
            _dataBase.Quotes.Add(newNode);
            _dataBase.SaveChanges();
            

        }
       
        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value){

            //Редактировать по ID
            //Новые данные передаются в JSON      

            var deserializeRequest = new {
                Text = "",
                Author = "",
                CategoryId = -1,
                CreateDate = new DateTime()
            };

            deserializeRequest = JsonConvert.DeserializeAnonymousType(value, deserializeRequest);

            var editNode = _dataBase.Quotes.Single(note => note.QuoteId == id);
            editNode.Author = deserializeRequest.Author;
            editNode.CategoryId = deserializeRequest.CategoryId;
            editNode.CreateDate = deserializeRequest.CreateDate;
            editNode.Text = deserializeRequest.Text;

            _dataBase.SaveChanges();

        }


        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id){

            //Удалить по ID          

            var deleteNode = _dataBase.Quotes.Single(note => note.QuoteId == id);
            _dataBase.Quotes.Remove(deleteNode);
            _dataBase.SaveChanges();

        }
    }
}
