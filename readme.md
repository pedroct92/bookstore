#Bookstore

The application basically provides a CRUD for books. A REST service was build to provide the backend features and the frontend there is JQuery client.

###### Backend:
	* Java 1.8
	* Spring boot
	* JPA
###### Frontend:
	* Bootstrap
	* Jquery 
	* Datatables 
	* Dropzone
	* Bootstrap-notify
	* Jquery.rest
	
###### Database:
	* Postgresql
The application is using JPA and only standard SQL so if you want you can plug any database to this application, as long as you place its diver on the <code>pom.xml</code>.
	

###### Instructions:

Set the database credentials on the <code> application.properties </code></pre>  
<pre><code>spring.datasource.url= jdbc:postgresql://localhost:5432/bookstore
spring.datasource.username=username
spring.datasource.password=password</code></pre>

Hibernate is set to <code> spring.jpa.hibernate.ddl-auto=update </code> update the database when the server is started so in order to create the tables you just have to create the database and it will create all the tables for you. 

On the project directory run <code> mvn clean install exec:java </code> spring boot will start an embedded tomcat running on the 8080 port. 
