[![Live Demo](https://img.shields.io/badge/Live_Demo-black?logo=googlechrome&style=for-the-badge)](https://graphql-backend.samueledwin.com)

A nearly production ready implementation of a GraphQL server incorporating industry best practices.

## Highlights
✅ Well designed schema with reusable objects.  
✅ Standard authorization: Users can only modify products for their own shop, etc.  
✅ Field level authorization: Only admins and shop owners can see the shop's address, Only admins and the user can see the user's date of birth.  
✅ Malicious query protection: Queries beyond certain depth are rejected.  
✅ Data loader pattern to prevent n+1 query problem.  
✅ Relay compliant pagination.  
✅ Input limit validation.  
✅ Robust error handling.  
✅ 100% type safety with TypeScript and graphql-codegen.  

## What this project is NOT about
- Complete authentication solution. I built just enough so users can sign in.
- Highly optimized SQL queries.

## Additional notes
- The GraphQL server is embedded within a Next.js route for easy hosting with Vercel
- Introspection and playground is enabled so that visitors can play around with the playground.

## Technologies
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white&style=for-the-badge) 
![Apollo GraphQL](https://img.shields.io/badge/Apollo_GraphQL-311C87?logo=apollographql&logoColor=white&style=for-the-badge) 
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge) 
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74E?logo=drizzle&logoColor=black&style=for-the-badge) 
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&style=for-the-badge) 
![Next.js](https://img.shields.io/badge/Next.js-black?logo=nextdotjs&style=for-the-badge) 
