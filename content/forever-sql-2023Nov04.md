---
title: "Forever SQL"
date: 2023-11-04
excerpt: Why SQL remains worth learning as the foundation beneath applications, APIs, and business data
tags: [SQL, Databases]
source: LinkedIn
disabled: false
aiAssisted: false
---

SQL is a Structured Query Language for Creating, Retrieving, Updating, and Deleting, or CRUDing, data from an RDBMS (Relational Database Management System).

SQL has been part of information technology for decades. Many programming languages, tools, frameworks, and platforms have come and gone. SQL will continue to serve well into the future.

Many libraries have been built to support information technology's goal of CRUDing data and then transforming that data into information for business intelligence. For example:

```text
SQL -> JDBC -> Hibernate -> Java Persistence API (JPA) -> Spring Data JPA
```

Each layer creates increasing functionality for software engineers, so we can quickly get to coding the essential business logic.

For a backend software engineer who writes business process logic, SQL is directly or indirectly part of everyday life.

For a front-end software engineer, it may not be so apparent. But when an application's UI needs to CRUD data, APIs such as REST API and GraphQL are used. After passing through several layers, the request eventually leads to a SQL call to an RDBMS, where structured data is stored in tables.

What about NoSQL, or non-relational databases? Yes, it is different. SQL is not used here. NoSQL still requires CRUDing data, though.

So why should you learn or at least understand the concept of SQL?

You may not be creating, updating, and deleting data every day. Still, there is a good chance you are consuming data every day and therefore retrieving data indirectly through an application.

Let us say an IT recruiter needs to know how much commission was earned in the last month. You can run pre-built reports offered by the IT system used by your company.

But what if you need to do some custom data mining? For example, retrieve the total commission earned last month by each recruiter from only Canadian clients. You can call the IT system vendor and ask them to build the report, wait *n* days, and pay *n* dollars. Or, if you have access to the RDBMS, you can use SQL to query the data yourself or ask the database developer on your team.

Perhaps learning SQL is not for you, but I think understanding the concept and the basics may open the doors to intelligent decision-making through data. Given that SQL has been around for decades and should be here for many more, it is a skill worth learning.

You can [get started here](https://lnkd.in/gx7Wg4Jv).

[Originally published on LinkedIn](https://www.linkedin.com/posts/kamlesh1808_forever-sql-sql-is-a-structured-query-language-activity-7126592024689983488-JZQo).
