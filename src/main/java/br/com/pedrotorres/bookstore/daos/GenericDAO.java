package br.com.pedrotorres.bookstore.daos;

import java.util.List;

import javax.persistence.Query;

public interface GenericDAO<PK, T> {
	void persist(T entity);
	
	void merge(T entity);
	
	void remove(T entity);
	
	void removeById(PK id);
	
	T getById(PK id);
	
	List<T> findAll();
	
	Query createQuery(String query, Object ...params);
}
