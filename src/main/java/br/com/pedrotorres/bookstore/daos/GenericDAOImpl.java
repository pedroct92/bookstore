package br.com.pedrotorres.bookstore.daos;

import java.lang.reflect.ParameterizedType;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

public abstract class GenericDAOImpl<PK, T> implements GenericDAO<PK, T>{
	
	@PersistenceContext
	private EntityManager manager;
		
	@Override
	public void persist(T entity) {
		manager.persist(entity);
	}

	@Override
	public void merge(T entity) {
		manager.merge(entity);
	}

	@Override
	public void remove(T entity) {
		manager.remove(entity);		
	}

	@Override
	public void removeById(PK id) {
		T entity = getById(id);
		manager.remove(entity);
	}

	@Override
	public T getById(PK id) {
		return manager.find(getTypeClass(), id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> findAll() {
		return manager.createQuery("FROM "+ getTypeClass().getName()).getResultList();
	}

	@Override
	public Query createQuery(String query, Object... parameters) {
        Query q = manager.createQuery(query);
 
        for (int i = 1; i <= parameters.length; i++) {
            q.setParameter(i, parameters[i]);
        }
        return q;
    }
	
	@SuppressWarnings("unchecked")
	private Class<T> getTypeClass() {
        return (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
	}
}
