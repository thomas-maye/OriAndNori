<p align="center">
<img  src="https://github.com/thomas-maye/OriAndNori/blob/main/Stage%202/images/Ori%26Nori%20-%20Logo.png" width="200"/>
</p>

# PortFolio Project - Development of the project charter (Stage 2) 📝

## Definition of project objectives 🎯

**Objective:** Develop an innovative web platform aimed at promoting animal socialization by connecting pet owners and facilitating interactions. This project addresses the need to enable animals to socialize in a safe, structured, and enjoyable environment, thereby enhancing the well-being of both the animals and their owners.

**1. Interface:** Create a user-friendly platform that simplifies the organization of pet meetups, ensuring a smooth and enjoyable experience for users.  
**2. Advanced filtering tools:** Offer powerful search and filtering options based on species, breed, age, temperament, location to identify the most suitable compatibilities.  
**3. Community engagement and retention:** Integrate gamification elements, such as rewards, badges, and progress tracking, to encourage active participation and foster a sense of belonging among pet owners.  
**4. Security and trust:** Implement features such as profile verification, user reviews, and guidelines to ensure safe and positive interactions between animals and their owners.

## Objectives SMART 💡

| Objective | Specific | Measurable | Achievable | Relevant | Time-bound |
|-----------|----------|------------|------------|----------|------------|
| **Management of pet meetups** | Create a basic form to add and search for meetups. | The features have been parsed into lower-level features that allow us to manage the progress of the project. | The plan includes training sessions (Adonis). If the schedule is followed, this objective is achievable. | This feature is at the root of the project. | Develop within 1 to 3 weeks |
| **Enable efficient search for meetups/pets** | Creation of filter feature. | The features have been parsed into lower-level features that allow us to manage the progress of the project. | The technology has already been used in previous projects. It is well-mastered. | Enabling efficient filtering is one of our most important needs. | 1 week |
| **Gather user experience** | Create a form to gather user experience and rate animal behavior. | Comments must be properly stored in the database and accessible for review. | The technology has already been used in previous projects. It is well-mastered. | User feedback is of utmost importance to us and will be used as a rating system. | 1 week |
| **Front End Development** | See the specifications document and wireframe mockups in Figma or Penpot. | Which follows the specifications document. | The plan includes training sessions (Adonis). If the schedule is followed, this objective is achievable. | Need to use Ori&Nori. | Start the front-end development within 2 weeks, then properly integrate all the features. |
| **Verify the quality of the implemented features** | Perform unit tests on each endpoint for the MLP features. | Measurable by the success of the unit tests. | Researching unit testing frameworks is planned, along with familiarizing the team with them. | Essential priority to ensure the stability of the MLP. | Conduct tests throughout the progress of the project. |

## Identify the stakeholders and team roles 👥

### Internal stakeholders

**Development team (Web developers):** Responsible for creating and maintaining the application (backend, frontend, database).

**Project Manager:** Monitors the project's progress, ensures that objectives are met within deadlines, and facilitates communication among team members.

**Tutors:** Assist with technical feedback and provide advice on implementation and best practices.

| Role | Responsibilities | Affectation |
|------|------------------|-------------|
| **Project Manager** | Monitors the project's progress, ensures that objectives are met within deadlines, and facilitates communication among team members. | Thomas MAYE |
| **Team Lead** | Takes major technical decisions, coordinates the team's actions, and ensures proper management of the technology stack. | Maël EZANIC |
| **Backend Developer** | Designs and develops server-side functionalities, manages the PostgreSQL database, and creates the necessary APIs. | Maël EZANIC |
| **Frontend Developer** | Develops the user interface with Tailwind CSS, ensures intuitive navigation, and integrates the various frontend features. | Thomas MAYE |
| **QA Tester** | Creates and executes unit tests to ensure all features meet expectations and work without errors. | Maël EZANIC |
| **UX/UI Designer** | Creates user-friendly and intuitive interfaces, working closely with developers to meet design requirements. | Thomas MAYE |

### External stakeholders

**End users:** Use the platform to organize meetups for animals.

**External partners (veterinarians, dog trainers, shelters, pet sitters):** They provide educational resources, offer services, and other practical information for full use of the website/application.

**Server Host:** Provides hosting for the site and manages the necessary server resources for the deployment and performance of the platform.

**Pets (Indirect stakeholders):** The central objective of the project is to improve their well-being through socialization and interaction with other animals in a secure environment.

## Definition of the scope 🌐

### In-Scope

| Feature | Description |
|---------|-------------|
| **Web platform for animal socialization** | Creation of a website to connect pet owners and their animals. |
| **Create profile for pets and owners** | Each user will be able to create a profile for themselves and for their pet. |
| **Management of animal meetups** | Event management system with the creation and viewing of meetups. |
| **Advanced search system** | Allow filtering of meetups by species, breed, age, temperament, location, and availability. |
| **Gamification** | Add rewards, badges, and progress tracking to encourage user engagement. |
| **Security and profile verification** | Implement a system to validate user and pet profiles (via email, manual verification). |
| **Message** | Create a discussion with meetup participants and the ability to chat individually with pet owners (under certain conditions). |
| **Simple and intuitive user interface with Tailwind CSS** | Using Tailwind for a minimalist and responsive design. |
| **Unit tests and code quality** | Creation of unit tests to ensure the stability of the core features of the MVP. |
| **Backend with PostgreSQL and Adonis.js** | Using PostgreSQL to store user and animal information, with Adonis.js for the backend API. |
| **Educational resources** | Integration of educational content on animal socialization, partnership with veterinarians and dog trainers. |
| **Relation/Tracking** | Create relationships between animals once they meet. Option to become friends. Track the number of meetups. |

### Out-of-Scope

| Feature | Description |
|---------|-------------|
| **Mobile applications** | This project focuses solely on a web platform. |
| **Offering pet-sitting services** | The project will not include connecting users for pet-sitting services. |
| **Listing of veterinarians** | The project will not involve creating a list of veterinarians or animal healthcare services. |
| **Online educational advice** | No pet consultation or training coaching services will be included. |
| **Recommendations for walks** | The project will not provide geographical recommendations or routes for pet walks. |
| **Community forum** | The project will not include a forum for users to engage in discussions on various topics. |
| **Management of inclusions for specific animals** | The project will not aim to include uncommon animals (e.g., reptiles or exotic birds). |
| **Translation into all languages** | The platform will only support English and French in this phase, without the possibility of multi-language translation. |
| **Real-time updates** | Real-time synchronization features for events or notifications are not included. |
| **Advanced user rating system** | No complex rating systems or reviews for users. |
| **Notifications (pop-up)** | Not planned in this version until there is a mobile application. |

## Risk identification ⚠️

Generally, the risks are related to:

**Lack of Knowledge:**
The major part of the identified risks emanate from lack of knowledge, which can cause prolonged delays or make certain tasks more demanding.
Overall Solution : Careful planning, prioritizing critical features, and including learning phases in the timeline can greatly help mitigate these risks.

**Security and Responsibility:**
Risks related to application and system security, as well as the management of conflicts or incidents, are critical for maintaining user trust and legally protecting the platform.
Overall solution : Invest in standard security protocols and define clear terms and conditions of use.

**Communication and organization:**
Good team management and tools can prevent many potential complications.
Overall Solution : Effective project management tools and regular communication are essential.


Here are the details of all the risks we have identified :

### Identified Risks and Mitigation Strategies

| Risk | Impact | Strategies to adopt |
|------|--------|----------------------|
| **Underestimation of the time required for training** | Extension of deadlines and delays in development. | Integrate dedicated training time into the schedule. Identify critical areas and provide targeted tutorials or learning resources. |
| **Underestimation of the time required to complete a task or feature** | Risk of exceeding deadlines or incomplete implementation of certain features. | Use agile methodologies to break down tasks into subtasks. Regularly review priorities to ensure that critical features are delivered. |
| **Application security (security vulnerabilities, poor management of user data)** | Exposure of sensitive data, loss of user trust. | Implement security checks (input validation, protection against SQL injections). Conduct regular code audits and use automated tools. |
| **System security (hosting and server)** | System outages, hacking, or data loss. | Choose a reliable hosting provider with automatic backups. Configure a firewall and HTTPS protocols to secure connections. |
| **Lack of knowledge about moderation** | Risks of inappropriate content or unresolved conflicts between users. | Develop an automatic reporting system and establish clear rules for users. Train the team to manage reports efficiently. |
| **Short timeline** | Incomplete delivery or last-minute rush at the end of the project, potentially impacting quality. | Prioritize features based on their importance for the MVP. Include time buffers to accommodate unexpected issues. |
| **Insurance for issues between animals during a meeting** | Legal or reputational risks in case of injury or issues between animals. | Add a disclaimer in the terms and conditions. Recommend that users subscribe to a liability insurance. |
| **Insurance for issues between owners during a meeting** | Legal or reputational risks in the event of conflicts or incidents between users. | Include terms and conditions that outline the platform's liability limits. Provide guidelines for respectful behavior. |
| **Lack of experience with the necessary tools** | Slow learning curve, potential technical errors. | Organize training sessions or hire mentors. Plan intensive testing phases to reduce errors before launch. |
| **Poor communication management between team members** | Lack of coordination, confusion in responsibilities, delays. | Use project management tools (Trello, Slack, etc.). Organize short and regular meetings to check on progress. |
| **Technological compatibility issues between different frameworks or libraries** | Unexpected bugs, delays in integration. | Validate the tools and technologies to be used from the start. Allocate time to test the integration of key components before production deployment. |
| **Underestimated workload for post-launch maintenance** | Difficulties in managing bugs and user requests after deployment. | Plan for minimal support after launch and define a roadmap for fixes. Prioritize critical feedback for quick intervention. |

## Develop a High-Level Plan 🗓️

### Timeline ⏳

The project will be divided into several phases, each with specific objectives and deliverables. 
On this [Roadmap](https://github.com/users/thomas-maye/projects/1/views/3) you can find the detailed planning of the project that we will follow. To simplify our work, we've decided to create an issue for each feature we're going to create (each feature having a well-defined route). This will make it easier to divide the work between the two of us.

To be more concise, here's an outline of the schedule.

### **Week 1-2 (December 9 to 20):** 🎯

*Stage 1 - Team formation and idea generation.*

### **Week 3 (January 6 to 10):** 📜

*Stage 2 - Project Charter creation.*

### **Week 4-5 (January 13 to 24):** 📑

*Stage 3 - Technical documentation finalized.*

### **Week 4-10 (January 20 to March 7):** 🚀

*Stage 4 - MVP Development + Testing + Deployment.*

### **Week 11-12 (Mars 10 to 20):** 🎤

*Prepare the Final Presentation and closure.*
