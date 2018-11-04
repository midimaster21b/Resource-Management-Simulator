# CS 452 Program 3: Resource Manager

## Overview
The purpose of this programming assignment is to reinforce your understanding of the role of the operating system as a resource manager.  To do this, you will implement a simulation that tracks system state and utilizes a deadlock detection protocol.

## Activities
- Develop a program that simulates an operating system functioning as a resource manager.
- This is to be an individual programming assignment.
- Submit your well-documented source code and sample runs/snapshots.  Be prepared to demonstrate your program.

## Programming Assignment (Deadlock-Detection Resource Manager)
The primary task of a resource manager is the efficient and correct allocation of resources.  To do this properly, the manager must be completely informed as to the current state of the system -- processes, resources available, what resources does each process own, what resource does each process want.  This requires some sort of dynamic internal represenation of the resource allocation graph described in your textbook (see Section 5.11 on Deadlocks).

Given complete knowledge of the current state of the system, it should be possible for a resource manager to conduct an evaluation of the system.  Obviously, a request for a resource that is currently being used cannot be granted, and the requesting process must be delayed.  However, sometimes a process is not merely delayed, but deadlocked; and the resource manager should be able to detect this problem and either produce diagnostic output or take corrective measures.  This suggests the need for some type of deadlock detection protocol, such as a cycle-detection algorithm.

The goal of this assignment is to create a resource manager and simulate the activity of the manager in response to changing run-time conditions.  The system you will model has multiple processes, multiple resource types, but only a single instance of each resource class (this makes it easier to detect deadlock).

The input file(s) posted on the course info page have the following format:
- Processes:  an integer representing the total number of processes in the system
- Resources:  an integer representing the total number of resource classes in the system.  There is one instance of each resource type.
- Resource request: the name of a process and the name of the resource it is requesting
- Resource release: the name of a process and the name of the resource it is releasing

The first two values (processes, resources) should be used to initialize your system.  The remaining lines in the input file consist of resource requests/releases that represent the activity of the various processes in the system over time.  At each resource request, your program should display the activity taken as a result of the request (e.g. "P2 now owns R3"), and output the result of a deadlock detection check (e.g. "System is deadlocked: processes P1, P2").

__Output__

An additional requirement is that your program must graphically display output.
- you are already maintaining some sort of internal representation of system state in the form of a resource allocation graph.  Display the graph.
- the graph should change dynamically in response to changes in system state (e.g. requests, allocations, releases, deadlocks).

**Guidelines:**
- this is a **simulation** -- you may use any language on any platform
- you may modify the format of the input files as desired
- be sure to incorporate informative/diagnostic output into your program
- it is recommended that you create a multi-file solution.  Most sophisticated programs consist of multiple files (usually written by different developers).  They are built (compiled) and work together to implement a solution.

  + recall the Model-View-Controller (MVC) paradigm, or the Model-View-Presenter (MVP) pattern.  The suggested approach is to completely de-couple your internal representation and "engine" from the code that implements the graphical display.
  + this would be a good opportunity to practice using build tools such as make or ant, or professional environments such as Visual Studio, Eclipse, or PyQt.

## Possible Enhancements

You must demonstrate the correct execution of your program on the posted sample input files.  However, you may choose to create an additional, enhanced version of your resource manager.
- create a deadlock avoidance resource manager
  + add a priori knowledge regarding resource usage to the initialization phase
  + add claim edges to your resource allocation graph
  + implement a deadlock avoidance protocol as described in class
- implement  a detect-and-recover policy
  + develop a protocol for recovering from detected deadlocks (as described in class)