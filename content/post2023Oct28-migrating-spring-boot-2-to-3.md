---
title: "Migrating from Spring Boot 2 to Spring Boot 3"
date: 2023-10-28
excerpt: Lessons from migrating a Spring Boot 2 microservice to Spring Boot 3 and thinking carefully about API evolution
tags: [Spring Boot, Microservices]
source: LinkedIn
disabled: false
aiAssisted: false
---

Recently, I migrated a Spring Boot 2 microservice to Spring Boot 3. The project used Java 17, Spring Data JPA, Spring Batch 4, Google Cloud services such as Pub/Sub, and Cloud SQL PostgreSQL.

This meant automatically migrating from Spring Framework 5 to 6, Hibernate 5 to Hibernate 6.2, Spring Batch 4 to 5, and more.

The migration was relatively quick, following the [official migration guide](https://lnkd.in/gsey99gC).

There was one complication I ran into. Spring Batch 5 had many deprecation and other implementation changes.

One of them was, and I quote from the documentation:

> Historically, Spring Batch provided a map-based job repository and job explorer implementations to work with an in-memory job repository. These implementations were deprecated in version 4 and completely removed in version 5. The recommended replacement is to use the JDBC-based implementations with an embedded database, such as H2, HSQL, and others.

I had to dig deeper into the documentation to accommodate this change.

You may ask, what is your point?

Software engineers have to make conscious decisions when making changes to published public APIs, tools, and frameworks. Evolution is a constant. However, it has to be done carefully to minimize the effort required for migration. Also, the change must add value to its users, such as making it simpler to use. New features can be added, but they should not negatively impact current functionality running in production.

In a microservices architecture, constantly changing business requirements require software engineers to update the REST API, internal service classes, and domain layer implementation.

At times, only the internal implementation requires change. In this instance, the calling microservice does not need to change. But often, the request and response model classes require updates. In this instance, the developer can create a new API to accommodate this change or change the existing API. In both scenarios, the users of the other microservice need to be informed of the change so they can use it for their needs.

To summarize, when building REST APIs, frameworks, and tools for public consumption by other services, they must be thoroughly discussed, designed, code-reviewed, well-documented, and communicated. In smaller projects, you can get away with just communication, but in projects with larger external impact, one should do all.

Thanks for reading. Feel free to chime in the comments section.

[Originally published on LinkedIn](https://www.linkedin.com/posts/kamlesh1808_migrating-from-spring-boot-2-to-spring-boot-activity-7124080936933105664-ma_r).
