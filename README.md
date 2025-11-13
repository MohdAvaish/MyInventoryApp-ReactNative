# MyInventoryApp (React Native)

A full-stack, real-time inventory management mobile application built from scratch by **Mohd Avaish Raeen**.

This is not just a UI project; it's a complete, cloud-connected, and secure application that allows users to sign up, log in, and manage their own private stock list.

---

## 🚀 Key Features

* **Full-Stack Functionality:** Complete CRUD (Create, Read, Update, Delete) operations for inventory items.
* **Secure Authentication:** Users can create an account, log in, and log out using **Firebase Authentication**.
* **Private User Data:** Each user's inventory list is 100% private. Users can only see and manage the items they created, which is secured using **Firestore Security Rules**.
* **Real-time Cloud Database:** Data is synced instantly across the app and the cloud using **Firebase Firestore's** real-time listener (`onSnapshot`).
* **Professional UI:** A clean, modern, and consistent user interface across all screens (Login, Dashboard, Add/Edit).

---

## 🛠️ Tech Stack

* **Frontend:** React Native
* **Framework:** Expo (with Expo Router for navigation)
* **Backend & Database:** Google Firebase
* **Core Services:**
    * **Firestore Database:** For real-time data storage.
    * **Firebase Authentication:** For user management (Login/Signup).
* **State Management:** React Hooks (`useState`, `useEffect`)

---

## 🏃‍♂️ How to Run This Project Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/MohdAvaish/MyInventoryApp-ReactNative.git](https://github.com/MohdAvaish/MyInventoryApp-ReactNative.git)
    cd MyInventoryApp-ReactNative/MyInventoryApp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    * Go to [Firebase](https://firebase.google.com/) and create a new project.
    * Enable **Authentication** (Email/Password method).
    * Enable **Firestore Database**.
    * Register your Android app (using the package name `com.avaish.myinventoryapp` from `app.json`).
    * Download the `google-services.json` file and place it in the root of the project.
    * Copy your project's config keys from the Firebase console into `firebaseConfig.js`.

4.  **Run the app:**
    ```bash
    npm run android
    ```
    (Ensure you have an Android Emulator running or a physical device connected)

---

## 👨‍💻 Author

* **Mohd Avaish Raeen**
* **GitHub:** [MohdAvaish](https://github.com/MohdAvaish)