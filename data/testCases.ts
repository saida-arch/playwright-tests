

export interface TestCase {
  id: number;
  description: string;
  project: string;
  taskName: string;
  column: string;
  tags: string[];
}

const testCases: TestCase[] = [
  {
    id: 1,
    description: 'Implement user authentication is in Web Application To Do',
    project: 'Web Application',
    taskName: 'Implement user authentication',
    column: 'To Do',
    tags: ['Feature', 'High Priority'],
  },
  {
    id: 2,
    description: 'Fix navigation bug is in Web Application To Do',
    project: 'Web Application',
    taskName: 'Fix navigation bug',
    column: 'To Do',
    tags: ['Bug'],
  },
  {
    id: 3,
    description: 'Design system updates is in Web Application In Progress',
    project: 'Web Application',
    taskName: 'Design system updates',
    column: 'In Progress',
    tags: ['Design'],
  },
  {
    id: 4,
    description: 'Push notification system is in Mobile Application To Do',
    project: 'Mobile Application',
    taskName: 'Push notification system',
    column: 'To Do',
    tags: ['Feature'],
  },
  {
    id: 5,
    description: 'Offline mode is in Mobile Application In Progress',
    project: 'Mobile Application',
    taskName: 'Offline mode',
    column: 'In Progress',
    tags: ['Feature', 'High Priority'],
  },
  {
    id: 6,
    description: 'App icon design is in Mobile Application Done',
    project: 'Mobile Application',
    taskName: 'App icon design',
    column: 'Done',
    tags: ['Design'],
  },
];

export default testCases;
