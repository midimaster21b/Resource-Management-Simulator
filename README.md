This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Resource Management Simulator

This program was written to fulfill the requirements for the assignment as viewed in [ASSIGNMENT.md](ASSIGNMENT.md).

## Running The Program

The program requires the user to supply a file following the format guidelines below. The user can then step through the supplied file's program using the instruction navigation buttons.

## Instruction File Format

1. The first two lines in the file tell the user how many processes and resources will be used for this run.

   **Example:**

   ```
   5 processes
   3 resources
   ```

   These lines create the processes and resources that will be referenced through the remainder of the file. For the example above, processes will be referenced as p0 through p4 and the resources will be referenced as r0 through r2.

1. The lines following the first two lines fall under the following formats.

   **Example:**

   ```
   p0 requests r0
   p1 releases r2
   ```

   Where p0 is the zero'th process and r1 is the one'th resource. This notation always follows the format `pX {keyword} rY` and can be used for any of the processes and resources created in the first two lines of the file.

There are only two keywords available for the program: `requests` and `releases`. When the `requests` keyword is used the process that was specified before the keyword will attempt to gain exclusive access to the resource specified following the keyword. When the `requests` keyword is used, one of two outcomes will occur:
1. If the resource is free the process will gain exclusive access to the resource.
1. If the resource is currently held by another process, the process will be put into a waiting queue until the resource is released by the other process.

The `releases` keyword can only be used by a process on a resource that is has exclusive access to currently. If the process specified before the keyword does not have exclusive access to the resource an error will occur and an error message will be printed to the console.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
