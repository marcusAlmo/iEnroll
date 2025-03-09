# iEnroll 
Welcome to iEnroll, a web-based desktop and mobile platform for efficient enrollment in schools. This README file contains instructions on the project's file structure, naming conventions, other programming practices, and a guide on how to run this project.

## File Structure
This project shall have the following project structure:

```sh
src
|
+-- app               # application layer containing:
|   |                 # this folder might differ based on the meta framework used
|   +-- routes        # application routes / can also be pages
|   +-- app.tsx       # main application component
|   +-- provider.tsx  # application provider that wraps the entire application with different global providers - this might also differ based on meta framework used
    +-- admin         # For components and files related to the Admin interface
      |
      +-- components  # For components only used inside the admin page
    +-- student       # For components and files related to the student interface
      |
      +-- components  # For components only used inside the student page
|   +-- router.tsx    # application router configuration
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # global configurations, exported env variables etc.
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application
|
+-- stores            # global state stores
|
+-- testing           # test utilities and mock data
|
+-- types             # shared types used across the application
|
+-- utils             # shared utility functions
```
*Retrieved from https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md*

## File Naming Conventions
### Variables, Lambda Methods, and Functions
Use the **camelCase** for naming such.
- `const variableName`
- `function getDate()`

### Database attributes
Use the **snake_case** for naming such.
- `f_name`
- `l_name`
- `m_name`

### Interfaces, Types, and Components
Use the **PascalCase** for naming such.
- `type ComponentProps = {...}`
- `interface ComponentInterface = {...}`
- `EnrollmentTab.tsx`


### For directories
Use the **kebab-case** for naming directories
- `/app/enrollment-management`
  - Sample use: `import Component from "@/app/enrollment-management`
  - Illustration:
  ```sh
    /pages
    |
    +-- /admin-dashboard
    |
    +-- /settings-page
  ```

Use the **PascalCase** for component directories when each folder has an index file.
  - Illustration:
  ```sh
  /src
  |
  +-- /components
      |
      +-- /UserProfile
          |
          +-- index.tsx
          |
          +-- UserProfile.tsx
          |
          +-- UserProfile.styles.ts
  ```

## For other Typescript files

| **Type**           | **Naming Convention**         | **Example**                          |
|--------------------|-----------------------------|--------------------------------------|
| **Type Alias**     | PascalCase                   | `type UserProfile = { ... }`         |
| **Interface**      | PascalCase                   | `interface UserProfile { ... }`      |
| **Enum**          | PascalCase (UPPER_CASE values) | `enum UserRole { ADMIN, USER }`      |
| **Object Keys**    | camelCase                    | `{ firstName: string }`              |
| **Generic Types**  | PascalCase (or T, U, V)      | `type ApiResponse<T> = { ... }`      |
| **Type Assertions** | camelCase                    | `const user = data as UserProfile;`  |
| **File Names**     | PascalCase (for components) / kebab-case (for global types) | `UserProfile.types.ts` / `user-types.ts` |

## Practices
- All statements are punctuated with a **semicolon**.
- Create new branches for new features.
- Feel free to create a `components` folder inside a specific `/app` directory if the components inside are not shared globally. 

## Others
For more info, visit this [conversation](https://chatgpt.com/share/67ca1dea-7d0c-800a-a901-014b9ceacda3).

## Running the project
To run the `front` directory, execute the following command on the terminal.
```sh
cd front
npm run dev
```
### Running the mobile interface
To run the localhost and make the site accessible to your mobile device, do the following steps.

1. Make sure that your local server and mobile device are connected to the **same network**.
2. Run `npm run dev -- --host` on the terminal.
3. Vite will display three URLs: one local (`http://localhost:5173`), and two networks (`http://[ip-address]:5173`). 
4. Enter the URL of one of the network URLs on the browser of your mobile device.
5. You should be able to see now the mobile interface on your mobile device.

(You can try appending `/log-in` or `meet-our-partners` on the URL. You should be able to see the page and not be redirected to the Warning Page.)

