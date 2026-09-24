---
title: "Read and Write Responsibility Segregation"
date: 2024-02-24
excerpt: Separating read and write data access in Spring Boot microservices
tags: [Spring Boot, Architecture]
source: LinkedIn
disabled: false
aiAssisted: false
---

Google Cloud databases such as Cloud SQL for PostgreSQL and AlloyDB are fully managed PostgreSQL services that can offer distinct instances for reading and writing data. Out of the box, read instances offer performance improvements when querying data.

When using separate read and write database instances with a Spring Boot microservice and JPA, you may need to create two separate data sources and two repository packages.

For example:

```java
@EnableJpaRepositories(
    basePackages = { "com.example.repository.readwrite" },
    entityManagerFactoryRef = "readWriteEntityManagerFactory",
    transactionManagerRef = "readWriteTransactionManager")
public class ReadWriteDataSourceConfig {
}

@EnableJpaRepositories(
    basePackages = { "com.example.repository.read" },
    entityManagerFactoryRef = "readEntityManagerFactory",
    transactionManagerRef = "readTransactionManager")
public class ReadDataSourceConfig {
}
```

The reason for this is that when the `ReadWriteDataSourceConfig` and `ReadDataSourceConfig` beans are created, the repository bean cannot be registered with the same name. To resolve this, create read and write repositories in separate packages.

This is good for read and write responsibility segregation.

Then one might realize that it makes sense to continue and create two distinct services and REST controllers as well, and perhaps continue even further by using read and write model classes as described in the CQRS pattern.

This leads to cleaner code implementation and is easier to read and maintain.

[Originally published on LinkedIn](https://www.linkedin.com/posts/kamlesh18_read-and-write-responsibility-segregation-activity-7167299567783272449-JLfm).
