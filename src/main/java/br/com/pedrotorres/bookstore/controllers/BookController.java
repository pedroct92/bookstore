package br.com.pedrotorres.bookstore.controllers;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.pedrotorres.bookstore.daos.BookDAO;
import br.com.pedrotorres.bookstore.models.Book;
import br.com.pedrotorres.bookstore.service.BookService;
import br.com.pedrotorres.util.Util;

@Transactional
@RestController
@RequestMapping("/book")
public class BookController {

	@Autowired
	private BookDAO bookDAO;
	
	@Autowired
	private BookService bookService;
	
	@RequestMapping(method = RequestMethod.GET)
	public Map<String, Object> getAllBooks() {
		Map<String, Object> response = new LinkedHashMap<String, Object>();
		List<Book> booksList = bookDAO.findAll();
		
		response.put("data", booksList);
		return response;
	}

	@RequestMapping(method = RequestMethod.GET, value = "{id}")
	public Book getBookById(@PathVariable Integer id) {
		Book book = bookDAO.getById(id);
		return book;
	}

	@RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public Book addBook(@RequestBody Book book) {
		bookService.save(book);
		return book;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "{id}", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public Book updateBook(@PathVariable Integer id, @RequestBody Book book) {
		book.setId(id);
		bookService.save(book);
		return book;
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "{id}")
	public Map<String, Object> deleteBook(@PathVariable Integer id) {
		Book book = bookDAO.getById(id);
		bookDAO.remove(book);
		Map<String, Object> response = new LinkedHashMap<String, Object>();
		response.put("message", "Book deleted successfully");
		return response;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "{id}/img/")
	@ResponseBody
	public HttpEntity<byte[]> getCoverImg(@PathVariable Integer id){
	    return Util.imgBase64ToHttpEntity(bookDAO.getById(id).getCover());
	}
}
