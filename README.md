# IT Helpdesk and Asset Management System

A full-stack portfolio project where employees report IT problems and technicians manage their resolution.

> Status: Planning and repository setup. Application features are not implemented yet.

## Planned roles
- Employee: create tickets and view their own requests.
- Technician: work on assigned tickets and record progress.
- Administrator: manage assignments, users and equipment.

## First milestone
- [ ] Build a ticket form with title, description and priority.
- [ ] Display submitted tickets using temporary data.
- [ ] Add status updates and basic validation.
- [ ] Make the interface work on mobile screens.

## Roadmap
- [x] Initialize the repository and project documentation.
- [ ] Build a React and TypeScript interface.
- [ ] Add a Node.js and Express REST API.
- [ ] Store tickets and users in PostgreSQL.
- [ ] Add login and enforce role and ownership permissions.
- [ ] Add assignments, comments and status history.
- [ ] Register equipment and link assets to tickets.
- [ ] Test critical workflows and unauthorized access.
- [ ] Add Docker and GitHub Actions checks.
- [ ] Deploy on AWS with HTTPS, logs and backup instructions.
- [ ] Explore AI ticket categorization and summaries with human review.

## Planned technologies
React, TypeScript, Node.js, Express, PostgreSQL, Docker, GitHub Actions and AWS.

Kubernetes and Azure are later learning exercises.

## Getting started
This repository currently contains documentation and configuration only. There is no runnable application yet.

```bash
git clone https://github.com/navithathewnim17-hub/it-helpdesk.git
cd it-helpdesk
git switch -c feat/ticket-interface
```

Installation and run commands will be added when application code exists.

## Development workflow
Define a small task, create a feature branch, implement and test it, then commit and open a pull request for review.

## Security
Use fictional data for public demonstrations. Never commit passwords, API keys, cloud credentials or real employee data. Keep secrets in ignored environment files and commit placeholder examples only. Ignoring a file does not remove it from existing Git history.
