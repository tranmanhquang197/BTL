package com.tsolution.config;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.tsolution._2repositories", entityManagerFactoryRef = "baseEntityManagerFactory", transactionManagerRef = "baseTransactionManager")
public class SpringDataSourceConfiguration {

	@Primary
	@Bean(name = "springDataSourceProperties")
	@ConfigurationProperties(prefix = "spring.datasource")
	public DataSourceProperties springDataSourceProperties() {
		return new DataSourceProperties();
	}

	@Primary
	@Bean(name = "springDataSource")
	@ConfigurationProperties(prefix = "spring.datasource")
	public DataSource springDataSource() {
		return this.springDataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class).build();
	}

	@Primary
	@Bean(name = "baseEntityManagerFactory")
	public LocalContainerEntityManagerFactoryBean baseEntityManagerFactory(EntityManagerFactoryBuilder builder) {
		return builder.dataSource(this.springDataSource()).packages("com.tsolution._1entities").build();
	}

	@Primary
	@Bean(name = "baseTransactionManager")
	public PlatformTransactionManager baseTransactionManager(
			final @Qualifier("baseEntityManagerFactory") LocalContainerEntityManagerFactoryBean baseEntityManagerFactory) {
		if (baseEntityManagerFactory == null) {
			return null;
		}
		EntityManagerFactory entityManagerFactory = baseEntityManagerFactory.getObject();
		if (entityManagerFactory == null) {
			return null;
		}
		return new JpaTransactionManager(entityManagerFactory);
	}

}
