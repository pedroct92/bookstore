package br.com.pedrotorres.bookstore.service;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Service;

import br.com.pedrotorres.bookstore.daos.BookDAO;
import br.com.pedrotorres.bookstore.models.Book;

@Service
@Transactional
public class BookService {
	
	@Autowired
	private BookDAO bookDAO;
	
	public void save(Book book){
		validateBook(book);
		
		if(book.getId() == null){
			bookDAO.persist(book);
		}else{
			bookDAO.merge(book);
		}
	}
	
	private void validateBook(Book book){
		StringBuilder exceptionBuilder = new StringBuilder();
		
		String message = "%s is required.";
		
		if(StringUtils.isBlank(book.getTitle())){
			exceptionBuilder.append(String.format(message, "Title")).append("\n");
		}
		
		if(StringUtils.isBlank(book.getAuthor())){
			exceptionBuilder.append(String.format(message, "Author"));
		}
		
		if(book.getNumPages() == null || book.getNumPages() < 0){
			exceptionBuilder.append(String.format(message, "Pages"));
		}
		
		if(StringUtils.isBlank(book.getCover())){
			exceptionBuilder.append(String.format(message, "Cover"));
		}
		
		if(exceptionBuilder.length() > 0){
			throw new ApplicationContextException(exceptionBuilder.toString());
		}
	}
}
