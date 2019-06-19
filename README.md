This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Resource Management Simulator

This program was written to fulfill the requirements for the assignment as viewed in [ASSIGNMENT.md](ASSIGNMENT.md).

## Starting The Program

1. Install the dependencies

   ```
   yarn install
   ```

1. Build a static version of the application

   ```
   yarn build
   ```

1. Change into static build directory

   ```
   cd build
   ```

1. Move the serve configuration file into the build directory

   ```
   mv ../serve.json .
   ```

1. Serve the statically built application

   ```
   npx serve
   ```

   Serve the statically built application. The default serve port is 5000.

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
