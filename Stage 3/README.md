<p align="center"><img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%202/images/Ori%26Nori%20-%20Logo.png" width="200"/></p>

# Portfolio Project - Technical Documentation (Stage 3)

## Presentation of Mockups/Wireframes and User Stories 📝

### Presentation of User Stories 👥

#### Format of User Stories 🧾

Each User Story follows the format:

> “As a [user type], I want [action] in order to [goal]”

#### Breaking down User Stories 🔍

- **Modularity and Scalability**: Since the project is meant to evolve, the User Stories were defined independently to facilitate the addition of new features without affecting existing ones. For example, user profile management was broken down into several User Stories (creation, modification, deletion) to allow for progressive implementation.
- **Prioritization of Essential Features**: We decided to prioritize the User Stories based on user impact and technical feasibility. For example, basic features such as registration and Meetup search were developed as a priority, while secondary features like ratings were planned for a later phase.
- **User-Centered Approach**: All the User Stories were written with a user-centric approach to meet the real needs of users, whether they are pet owners or simply looking for socialization events. For example, "As a dog owner, I want to be able to organize a Meetup in my favorite park to socialize my pet."
- **Considering Interactions Between Users**: Features like Meetups, pet friend management, and ratings were prioritized to promote user engagement and retention. For example, "As a user, I want to be able to rate a Meetup after my participation to share my experience with the community."

Here is the complete set of User Stories for our project:

## Features Overview

| **Class**  | **Feature Name**  | **As a**  | **I want to**  | **So that I can**  | **URL**  | **HTTP Method**  |
|------------|------------------|------------|----------------|----------------|------------------|--------------|
| **USER**  | User account creation  | Visitor  | Create an account with my email and password  | Access the platform and use its features  | `/register`  | `POST`  |
| **USER**  | User login  | User  | Log in to my account with my credentials  | Manage my information and access my personal data  | `/login`  | `POST`  |
| **USER**  | User logout  | Logged-in user  | Log out of my account  | Protect my personal information  | `/logout`  | `POST`  |
| **USER**  | Password reset  | User  | Reset my password via an email link  | Access my account if I forget my password  | `/password-reset`  | `POST`  |
| **USER**  | View user profile  | Logged-in user  | See a user’s profile  | View their Meetups and Pets  | `/<ID>/profile`  | `GET`  |
| **USER**  | Badges and achievements  | User  | Unlock badges and rewards  | Stay motivated to use the app  | `/profile/achievement`  | `GET`  |
| **USER**  | Profile management  | Logged-in user  | Edit my personal information  | Keep my profile up to date  | `/profile`  | `GET`, `PUT`, `DELETE`  |
| **USER**  | Upload profile picture  | Logged-in user  | Add a picture to my profile  | Make my profile more engaging  | `/profile/photo`  | `POST`  |
| **PET**  | Create a Pet profile  | Pet owner  | Add my Pet with details (personality, breed, species)  | Make my Pet visible to other users  | `/pets/create`  | `POST`  |
| **PET**  | View Pet profile  | User  | Display a Pet’s profile (personality, breed, species, number of meetups, friends list)  | Learn about a Pet  | `/pets/<ID>`  | `GET`  |
| **PET**  | Edit Personality  | Pet owner  | Edit my Pet’s personality  | Update my Pet’s details  | `/pets/<ID>/personality`  | `PUT`  |
| **PET**  | Edit Breed  | Pet owner  | Edit my Pet’s breed  | Update my Pet’s details  | `/pets/<ID>/breed`  | `PUT`  |
| **PET**  | Edit Species  | Pet owner  | Edit my Pet’s species  | Update my Pet’s details  | `/pets/<ID>/species`  | `PUT`  |
| **PET**  | Upload Pet photos  | Pet owner  | Add photos to my Pet’s profile  | Make my Pet’s profile more attractive and informative  | `/pets/<ID>/photo`  | `POST`  |
| **PET**  | Delete a Pet  | Pet owner  | Remove a Pet and all its details  | Delete a Pet that is no longer relevant  | `/pets/<ID>/delete`  | `DELETE`  |
| **PET**  | View Pet profiles  | User  | Browse nearby Pet profiles  | See the list of Pets  | `/pets`  | `GET`  |
| **PET**  | Advanced Pet search/filtering  | User  | Filter Pets based on criteria (age, species, breed, location, etc.)  | Find a companion for my Pet  | `/pets/search`  | `GET`  |
| **PET**  | Send friend request  | User  | Send a friend request to another Pet  | Make friends  | `/pets/<ID>/friends`  | `POST`  |
| **PET**  | Accept friend request  | User  | Accept a friend request  | Choose whether to accept or not  | `/pets/<ID>/friends/accept`  | `POST`  |
| **PET**  | Propose a Meetup  | Logged-in user  | Suggest an outing to another Pet  | Meet with a chosen Pet  | `/pets/<ID>/meetup`  | `POST`  |
| **PET**  | Manage my Pets  | Pet owner  | View, edit, or delete my Pets  | Manage all my registered Pets  | `/pets/my-pets`  | `GET`, `PUT`, `DELETE`  |
| **PET**  | Rate and review Pets  | User  | Rate a Pet and leave a comment (possibly outside of meetups)  | Share my experience to help others choose meetups  | `/pets/<ID>/review`  | `POST`  |
| **MEETUP**  | Create a Meetup  | Logged-in user  | Create a Meetup proposal  | Socialize Pets and organize gatherings  | `/meetups/create`  | `POST`  |
| **MEETUP**  | List Meetups  | Logged-in user  | View all created Meetups  | See the list of Meetups  | `/meetups`  | `GET`  |
| **MEETUP**  | Filter Meetups  | Logged-in user  | Filter Meetups based on criteria (location, Pets, duration, etc.)  | Find a suitable Meetup  | `/meetups/search`  | `GET`  |
| **MEETUP**  | Join a Meetup  | Logged-in user  | Sign up for a Meetup  | Participate and notify the organizer  | `/meetups/join`  | `POST`  |
| **MEETUP**  | Leave a Meetup  | Logged-in user  | Unregister from a Meetup  | Cancel participation and notify the organizer  | `/meetups/quit`  | `POST`  |
| **MEETUP**  | Edit a Meetup  | Logged-in user  | Edit my Meetup  | Update the details and inform participants  | `/meetups/<ID>/edit`  | `PUT`  |
| **MEETUP**  | Delete a Meetup  | Logged-in user  | Delete my Meetup  | Remove it and inform participants  | `/meetups/<ID>/delete`  | `DELETE`  |
| **MEETUP**  | Manage my Meetups  | Logged-in user  | View and organize Meetups I created or joined  | Keep track of my Meetup activities  | `/meetups/manage`  | `GET`, `PUT`, `DELETE`  |
| **MEETUP**  | View a Meetup  | Logged-in user  | Display Meetup details  | Know the characteristics of the Meetup  | `/meetups/<ID>`  | `GET`  |
| **MEETUP**  | View Meetup Pets  | Logged-in user  | See the list of Pets attending a Meetup  | Check participating Pets’ profiles  | `/meetups/<ID>/pets`  | `GET`  |
| **MEETUP**  | Rate and review a Meetup  | Logged-in user  | Give a rating and comment on a Meetup  | Share my experience  | `/meetups/<ID>/review`  | `POST`  |
| **REVIEW**  | List reviews  | Logged-in user  | View all reviews  | Access feedback  | `/reviews`  | `GET`  |
| **REVIEW**  | Manage my reviews  | Logged-in user  | Edit or delete my reviews  | Update my feedback  | `/reviews/my-reviews`  | `GET`, `PUT`, `DELETE`  |
| **ALL**  | Dashboard  | Logged-in user  | See an overview of my activities (profiles, meetups, messages)  | Quickly access important information  | `/dashboard`  | `GET`  |
| **ADMIN**  | Content moderation  | Admin  | Delete or modify inappropriate content  | Maintain a safe platform environment  | `/admin/moderation`  | `DELETE`, `PUT`  |
| **ADMIN**  | Statistics analysis  | Admin  | View platform usage metrics  | Optimize performance and identify trends  | `/admin/stats`  | `GET`  |

## Presentation of Mockups/Wireframes 🎨

### Objective of the Mockups 🎯

The wireframes were designed to provide a smooth and intuitive user experience. Each screen was designed to ensure consistent navigation and quick adoption by users. Below are mockups of the main features. But [here](https://www.figma.com/proto/VCVYHlXwpER6irErylGMik/Figma-basics?node-id=602-3410&p=f&t=LVkjQG0J8tPJfX1Z-1&scaling=scale-down&content-scaling=fixed&page-id=1669%3A162202) are all the mockups for our project. The advantage of this link is that the pages are scrollable. We've decided to present the mobile version of the site, as this is how it will be used most of the time.

<p align="center">
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/Home.png" width="200"/>
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/Menu.png" width="200"/>
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/Register.png" width="200"/>
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/Login.png" width="200"/>
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/CreatePet.png" width="200"/>
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/CreateMeetup.png" width="200"/>
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/SearchMeetup.png" width="200"/>
<img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Wireframes/JoinMeetup.png" width="200"/>
</p>

### Design Choices ⚙️

- **Simplicity and Accessibility**: We prioritized a clean design so that users can quickly understand the features and possible actions. For example, the registration screen offers a clear and concise form with a minimal number of required fields to reduce friction.
- **Highlighting Key Elements**: The main pages, such as registration, Meetup management, and pet management, are structured so that important information is immediately accessible. For example, on the Meetup management page, the most relevant events are highlighted, sorted by proximity and date.
- **Consistency with UX/UI Best Practices**: Action buttons are visible and strategically placed to avoid confusion. For example, the "Create a Meetup" button is always accessible at the top of the screen for immediate interaction.
- **Use of a Harmonious Color Palette**: To enhance readability and provide a clear visual identity for the platform, we adopted a soft and contrasted color palette, with distinct colors for primary and secondary actions.

The choice of these mockups and User Stories is based on a thorough analysis of user needs and best practices in design and user experience. The modular and progressive approach provides a solid foundation for the MVP while allowing flexibility for future developments of the project.

## Design System Architecture

### Architecture Overview

This diagram illustrates the system architecture, highlighting interactions between the Front-End, Back-End, database, and external APIs. The Front-End, built with TailwindCSS and Edge, communicates with a Back-End based on AdonisJs. The Back-End handles user requests and interacts with a PostgreSQL database as well as multiple external APIs (user data, geolocation, messaging, notifications). This schematic provides a clear view of data flows and the overall platform operation.

<p align="center"><img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Diagrams/Architectural%20diagram.png" alt="Architecture Diagram"/></p>

## Define Components, Classes, and Database Design 🛠️

### Data Model (ERD) 🗂️

This diagram represents the relational model of the database. It defines the system's main entities, such as users, pets, meetings, and reviews. Each entity is connected through logical relationships that illustrate the data structure and its interactions. Primary keys (PK) and foreign keys (FK) ensure the integrity of relationships between tables, ensuring consistent data management.

<p align="center"><img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Diagrams/ERD.png" alt="ERD Diagram"/></p>

## Create High-Level Sequence Diagrams 🖥️

### Sequence Diagram – Pet Profile Creation 🐾

This diagram illustrates the process of creating a pet profile, detailing interactions between the user, Front-End, Back-End, and database. The user fills out a form, which is validated before submission. In case of errors, messages are displayed. Once submitted, the Back-End processes the request, inserts the data into the database, and returns a unique identifier. Finally, a confirmation message is displayed to the user, indicating that the profile has been successfully created.

<p align="center"><img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Diagrams/Sequence%20Diagram%20for%20Pet%20Profile%20Creation.png" alt="Sequence Diagram Pet Creation"/></p>

### Sequence Diagram – Meetup Planning 🗓️

This diagram represents the process of creating and managing a meetup, highlighting interactions between the user, Front-End, Back-End, and database. The user initiates the process by opening a meetup creation form, which undergoes validation to ensure the accuracy of the entered information. If errors are detected, appropriate messages are displayed. Once the form is correctly completed and submitted, the Back-End processes the request, saves the data in the database, and generates a unique identifier for the meetup. The user then receives a confirmation of the creation.

The diagram also illustrates the process of viewing meetups by another user (User 2). The user can send a request to retrieve a list of available meetups. If they choose to participate in a meetup, a request is sent to update their status, followed by a participation confirmation. This diagram highlights the different steps and interactions required for creating, viewing, and registering for a meetup.

<p align="center"><img src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%203/Diagrams/Meetup%20Schedule.png" alt="Sequence Diagram Meetup Planning"></p>

## Document External and Internal APIs 🌐

### External API 🌍

For Ori&Nori, we have selected three external APIs to effectively meet our specific needs. These APIs will cover functionalities that we prefer to delegate to third-party services, either due to a lack of technical expertise or time constraints. One API will be used for geolocation, another for sending transactional emails (notifications), and a third for internal messaging within the Ori&Nori application.

#### [OpenCage](https://opencagedata.com/) 🌏

For geocoding in our application, we have chosen OpenCage, a reliable and easy-to-integrate API. It stands out for its global coverage and use of open data, primarily sourced from OpenStreetMap. Its clear documentation and practical examples make integration straightforward.

OpenCage offers transparent and affordable pricing, with 2,500 free requests per day, allowing us to conduct initial tests without limitations. Additionally, its flexible architecture ensures that OpenCage will remain a robust and scalable solution for Ori&Nori, regardless of the project's future growth.

#### [Pusher](https://pusher.com/) ⚡

For real-time messaging in our application, we have chosen Pusher, an API specialized in real-time communication via WebSockets. We choose it for its clear and detailed documentation, along with practical examples that simplify integration.

Pusher integrates easily with AdonisJs, which also supports WebSockets, enabling a quick and efficient setup of our messaging system. It handles both private channels (for chatting between friends) and public channels (for group discussions within a meetup, for example).

In addition to its ease of implementation, Pusher is cross-platform, ensuring optimal scalability if Ori&Nori expands to other devices. Its scalable architecture offers the flexibility needed to support the growth of our application.

Pusher offers a fair pricing model, providing 200,000 messages per day and 100 simultaneous connections, allowing us to conduct our tests effectively. This free plan is ideal for getting started and validating the real-time messaging system. If the project grows, it is possible to upgrade to paid plans for greater capacity, ensuring smooth scalability for Ori&Nori.

#### [SendGrid](https://sendgrid.com/en-us) ✉️

For transactional email management, we have chosen SendGrid, a reliable and easy-to-integrate API. Its service is used by many organizations, ensuring the reliability and speed of email deliveries. The documentation is clear, with practical examples for Node.js (and thus AdonisJs), as well as detailed guides and tutorials to facilitate integration.

SendGrid allows sending 100 emails per day for free, which is sufficient for our testing and showcasing the service. Its management of transactional notifications, with delivery tracking and the ability to create dynamic email templates, perfectly meets our needs. If the project grows, it’s easy to upgrade to paid plans to handle higher volumes of email deliveries.

### Internal API 🔒

We present the documentation of our internal API, which manages the core functionalities of Ori&Nori. This API was designed to meet our specific needs, ensuring smooth communication between the various components of the application. Here, you will find a table of the available endpoints.

| Description                      | URL                            | HTTP Method      | Input Format                                                                                                          | Output Format                 |
| -------------------------------- | ------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Create user account              | /register                      | POST             | JSON (email, password, username,)                                                                                     | JSON (user data, token)       |
| User login                       | /login                         | POST             | JSON (email, password)                                                                                                | JSON (user data, token)       |
| User logout                      | /logout                        | POST             | Header (Authorization: Bearer token)                                                                                  | JSON (message)                |
| Password reset                   | /password-reset                | POST             | JSON (email)                                                                                                          | JSON (message)                |
| Get user profile                 | /{ID}/profile                  | GET              | Query Param (user ID)                                                                                                 | JSON (user profile)           |
| View badges and rewards          | /profile/achievement           | GET              | Header (Authorization)                                                                                                | JSON (achievements)           |
| Manage profile                   | /profile                       | GET, PUT, DELETE | JSON (modifications)                                                                                                  | JSON (updated user data)      |
| Upload profile photo             | /profile/photo                 | POST             | photo: file (image file .jpg, .png)                                                                                   | JSON (photo URL)              |
| Create a Pet                     | /pets/create                   | POST             | JSON (name, species, breed, personality,birthday; vaccined, gender, description), photo: file (image file .jpg, .png) | JSON (pet data)               |
| View Pet profile                 | /pets/{ID}                     | GET              | Query Param (pet ID)                                                                                                  | JSON (pet profile)            |
| Edit Pet personality             | /pets/{ID}/personality         | PUT              | JSON (new personality)                                                                                                | JSON (updated pet data)       |
| Edit Pet breed                   | /pets/{ID}/breed               | PUT              | JSON (breed)                                                                                                          | JSON (updated pet data)       |
| Edit Pet species                 | /pets/{ID}/species             | PUT              | JSON (species)                                                                                                        | JSON (updated pet data)       |
| Upload Pet photo                 | /pets/{ID}/photo               | POST             | photo: file (image file .jpg, .png)                                                                                   | JSON (photo URL)              |
| Delete a Pet                     | /pets/{ID}/delete              | DELETE           | Query Param (pet ID)                                                                                                  | JSON (message)                |
| View Pets list                   | /pets                          | GET              | None                                                                                                                  | JSON (list of pets)           |
| Advanced Pet search              | /pets/search                   | GET              | Query Params (species, age, location, etc.)                                                                           | JSON (filtered pet list)      |
| Send friend request for Pet      | /pets/{ID}/friends             | POST             | JSON (friend pet ID)                                                                                                  | JSON (friend request status)  |
| Accept friend request            | /pets/{ID}/personality/accept  | POST             | JSON (request ID)                                                                                                     | JSON (updated friend list)    |
| Propose a Meetup to a Pet        | /pets/{ID}/meetup              | POST             | JSON (meetup details)                                                                                                 | JSON (meetup invitation)      |
| Manage my Pets                   | /pets/my-pets                  | GET, PUT, DELETE | JSON (pet modifications)                                                                                              | JSON (updated pet data)       |
| Rate and comment on a Pet        | /pets/{ID}/review              | POST             | JSON (rating, comment)                                                                                                | JSON (review confirmation)    |
| Create a Meetup                  | /meetups/create                | POST             | JSON (duration, location, date, time, number of places, authorized species)                                           | JSON (meetup data)            |
| List Meetups                     | /meetups                       | GET              | None                                                                                                                  | JSON (list of meetups)        |
| Filter Meetups                   | /meetups/search                | GET              | Query Params (location, date, etc.)                                                                                   | JSON (filtered meetup list)   |
| Join a Meetup                    | /meetups/join                  | POST             | JSON (meetup ID)                                                                                                      | JSON (confirmation)           |
| Leave a Meetup                   | /meetups/quit                  | POST             | JSON (meetup ID)                                                                                                      | JSON (confirmation)           |
| Edit a Meetup                    | /meetups/{ID}/edit             | PUT              | JSON (updated details)                                                                                                | JSON (updated meetup data)    |
| Delete a Meetup                  | /meetups/{ID}/delete           | DELETE           | Query Param (meetup ID)                                                                                               | JSON (message)                |
| Manage my Meetups                | /meetups/manage                | GET, PUT, DELETE | JSON (meetup modifications)                                                                                           | JSON (updated meetup data)    |
| View a Meetup                    | /meetups/{ID}                  | GET              | Query Param (meetup ID)                                                                                               | JSON (meetup details)         |
| View Meetup Pets                 | /meetups/{ID}/pets             | GET              | Query Param (meetup ID)                                                                                               | JSON (list of pets)           |
| Rate and comment on a Meetup     | /meetups/{ID}/review           | POST             | JSON (rating, comment)                                                                                                | JSON (review confirmation)    |
| Rate and comment on a Meetup Pet | /meetups/{ID}/pets/{ID}/review | POST             | JSON (rating, comment)                                                                                                | JSON (review confirmation)    |
| View reviews list                | /reviews                       | GET              | Query Params (filters)                                                                                                | JSON (list of reviews)        |
| Manage my reviews                | /reviews/my-reviews            | GET, PUT, DELETE | JSON (review modifications)                                                                                           | JSON (updated review data)    |
| View a review                    | /reviews/{ID}                  | GET              | Query Param (review ID)                                                                                               | JSON (review details)         |
| Edit a review                    | /reviews/{ID}/edit             | PUT              | JSON (updated review)                                                                                                 | JSON (updated review data)    |
| Delete a review                  | /reviews/{ID}/delete           | DELETE           | Query Param (review ID)                                                                                               | JSON (message)                |
| View user dashboard              | /dashboard                     | GET              | Header (Authorization)                                                                                                | JSON (user stats, activities) |
| Content moderation               | /admin/moderation              | DELETE, PUT      | JSON (content modifications)                                                                                          | JSON (moderation status)      |
| View platform statistics         | /admin/stats                   | GET              | Header (Authorization)                                                                                                | JSON (stats data)             |

## Source Code Management and Quality Assurance Strategy 💻🛠️

In software development, having a structured and effective process for code management and quality assurance is essential. This section presents the source code management (SCM) and quality assurance (QA) strategies for Ori&Nori, aiming to ensure a smooth development cycle, good code maintainability, and robust testing.

Thanks to our past experiences in collaborative projects, we have tested and refined these practices, ensuring they offer the best balance between efficiency, scalability, and maintainability. The SCM strategy we plan to adopt has proven effective in managing team contributions and preventing conflicts, while our QA approach is still evolving based on research and best practices as we develop our expertise in testing methodologies.

Furthermore, as Ori&Nori is a platform designed to facilitate social interactions between pet owners, it requires a stable and scalable codebase. Our strategies will ensure that we can develop and deploy new features quickly without compromising the application's quality and reliability. By linking each GitHub Project issue to a specific feature, we will improve task visibility and simplify project tracking, ensuring a well-organized development process.

### Source Code Management (SCM) Strategy ⚙️

#### Version Control System 📝

We plan to use **Git**, with our code hosted on **GitHub**, as the versioning system for Ori&Nori, facilitating collaboration, history tracking, and rollback capabilities.  
Each GitHub issue in our project will be linked to a new feature (or task), ensuring better visibility of both completed and upcoming work. This structured issue tracking will streamline task management and ensure smooth development progress.

#### Branching Model 🌱

We will adopt the **Git Flow** branching model to ensure a structured and efficient workflow:

- **Main branch (main):** Stable code, ready for production, updated only with tested and validated releases.
- **Development branch (develop):** Integration branch where new features are merged and tested before deployment.
- **Feature branches (feature/{feature-name}):** Dedicated branches for developing specific features.
- **Hotfix branches (hotfix/{hotfix-name}):** Immediate fixes for critical issues detected in production.
- **Release branches (release/{version}):** Used to prepare stable versions before merging into main.

This model is particularly well-suited for Ori&Nori as it ensures high stability and a clear development progression. Since our platform will integrate various features, such as pet profile management, event organization, and user interactions, separating these developments into feature branches will help maintain clarity and prevent conflicts.  
Additionally, in case of critical bugs in production, the hotfix mechanism will allow for a quick resolution without disrupting the development of other features.

#### Code Contribution Process 🤝

- **Feature Development:** Developers will create feature branches from the up-to-date develop branch.
- **Commits:** We will follow a strict commit message convention (e.g., "feat: add user authentication" or "fix: API bug correction").
- **Pull Requests (PRs):** Every change must be submitted via a PR targeting the develop branch.
- **Code Review:** PRs must be reviewed and approved before merging.
- **Merge Strategy:** We will use the **squash and merge** method to keep a clean commit history.

For Ori&Nori, this approach will ensure that all changes are systematically reviewed, preventing regressions and improving maintainability.  
For example, if we develop a new messaging system for pet owners, we will create a feature branch, conduct a code review, and validate the changes before merging them into the develop branch. This structured workflow will ensure that the feature is properly integrated and does not introduce unexpected bugs.

### Quality Assurance Strategy (QA) 🧪

#### Testing Approach 🔍

Given that our team has limited experience with large-scale automated testing, we have studied industry best practices to implement an optimal strategy for Ori&Nori.

| **Type de test**            | **Description**                                 | **Outils**                   |
|-----------------------------|-------------------------------------------------|------------------------------|
| **Unit Test**                | Tester des fonctions/modules individuels         | Jest                         |
| **Integration Testing**      | Testing Individual Functions/Modules             | Jest, Supertest              |
| **End-to-End Testing (E2E)** | Simulate User Interactions Across the Entire Application | Cypress                      |
| **API Testing**              | Verify the Stability of API Endpoints            | Postman, Supertest           |
| **Manual Testing**           | Conduct Exploratory and User Interface (UI) Testing | Revue manuelle               |

Ori&Nori will require a high level of reliability, especially for managing pet meetups and user profiles. Unit tests will ensure that essential functions, such as user authentication and pet profile creation, work as expected. Integration tests will validate that different modules interact correctly, preventing unexpected failures when multiple features are used together. End-to-end (E2E) tests will play a crucial role in ensuring that user journeys, such as searching for and booking a pet meetup, function smoothly.

#### Automated Testing Strategy 🤖

- **Unit and integration tests:** Executed on each pull request using Jest and Supertest.
- **E2E tests:** Run periodically with Cypress to validate the application's main workflows.
- **API tests:** Automated with Postman scripts in the CI/CD pipeline to ensure API stability.

By integrating these automated tests, we will ensure that critical features, such as search filters for pet compatibility and user profile updates, remain stable during deployments. As Ori&Nori evolves, automated testing will become essential for maintaining a high level of quality while iterating quickly on new features.

#### Continuous Integration and Continuous Deployment (CI/CD) 🚀

- **CI/CD Pipeline:** Implemented with GitHub Actions.
- **Pre-production Environment:** The develop branch is deployed for testing before production.
- **Production Deployment:** Only the main branch is deployed to the live environment.
- **Rollback Mechanism:** In case of a failed deployment, an automatic rollback to the last stable version will be performed.

#### Code Quality and Linting ✨

To maintain a clean and maintainable codebase, we will enforce strict linting and formatting rules:

- **ESLint:** To ensure that JavaScript and TypeScript code follows best practices and avoids common errors.
- **Prettier:** To automatically format code, ensuring consistency throughout the project.
- **Husky + Lint-staged:** To run pre-commit hooks that prevent the addition of incorrect code.

These measures will be particularly beneficial for Ori&Nori as we expand the codebase. Strict adherence to linting rules will ensure the maintenance of a consistent coding style, which is crucial when multiple contributors are working on different parts of the project.

### To summarize… 📋

By applying this structured approach to SCM and QA, we will ensure the stability, maintainability, and high quality of the code.  
For SCM, we will leverage the Git Flow model, enabling clear feature development, structured releases, and controlled hotfixes. Associating each issue with a specific feature will improve tracking and organization. For QA, we will adopt a progressive testing approach, balancing automated and manual tests to ensure reliability while adapting to our team's growing expertise.  
By applying these best practices, Ori&Nori will benefit from an evolving and reliable development workflow, providing a seamless experience for both developers and users.

## Justification of Technological Choices for Ori&Nori 🚀

### AdonisJS: A Modern, Structured Framework, Ideal for Ori&Nori 🔧

The choice of **AdonisJS** for **Ori&Nori** was made with the goal of exploring a modern technology that is perfectly suited to the project's requirements. With its well-defined structure and robust architecture, AdonisJS facilitates the creation of an efficient and scalable API, essential for managing interactions between pet owners and their companions on the platform. It offers an excellent balance between performance and productivity, which is crucial for a high-growth potential project like Ori&Nori.

- **Integrated ORM (Lucid)**: Database management is simplified with Lucid, allowing smooth interaction with PostgreSQL. This is particularly suited for Ori&Nori, where relationships between users, pets, events, and interactions must be easily managed and scalable.
- **MVC Architecture**: This architecture enables clear and structured code organization, making it easier to maintain and evolve Ori&Nori as new features are added.
- **Security and Performance**: AdonisJS provides built-in tools for authentication management and protects against common threats such as CSRF, XSS, and SQL injection. This ensures the security of user data, a top priority for Ori&Nori.

### PostgreSQL: A High-Performance Database, Perfect for the Complexity of Ori&Nori 🗄️

**PostgreSQL** was chosen specifically for its ability to efficiently handle complex relationships and sophisticated queries. Given the interconnected nature of the data in **Ori&Nori** — users, pets, meetups, and interactions — a high-performance and scalable database is essential.

- **Advanced Relationship Management**: PostgreSQL’s ability to handle complex relationships between tables is crucial for a project like Ori&Nori, where each user can interact with multiple pets and events. This allows for precise and efficient data management.
- **Performance and Scalability**: PostgreSQL ensures optimal performance, even with large volumes of data, allowing Ori&Nori to grow without compromising speed or platform efficiency.
- **Data Security and Integrity**: Data integrity is paramount, and PostgreSQL provides a robust transaction system, ensuring the reliability of the information exchanged within the platform.

### Tailwind CSS: Fast and Consistent Styling for a Modern User Interface 🎨

**Tailwind CSS** was chosen for its flexibility and fast implementation, allowing for the creation of a modern and consistent design perfectly suited to the needs of **Ori&Nori**.

- **Composability and Speed**: Tailwind allows for the construction of clean, responsive interfaces, ideal for a platform like Ori&Nori, which requires dynamic visual elements and smooth interactions with users and their pets.
- **Ease of Maintenance**: Using utility classes helps reduce style duplication and maintain clear, manageable code, even as the project grows.
- **Performance**: By generating only the used styles, Tailwind optimizes the size of CSS files, improving page load speed — a crucial factor for user experience on Ori&Nori.

The technological choices made for **Ori&Nori** are the result of a thorough analysis of its specific needs. **AdonisJS**, with its MVC architecture and Lucid ORM, provides a solid foundation for a robust and scalable API, perfectly suited to the requirements of Ori&Nori. **PostgreSQL**, with its advanced relationship management, ensures efficient and secure handling of the complex data of users and pets. Finally, **Tailwind CSS** guarantees a modern, responsive, and high-performance user interface, essential for a smooth and enjoyable experience. Together, these technologies form a coherent and optimized stack, perfectly suited for the development and sustainability of **Ori&Nori**.
