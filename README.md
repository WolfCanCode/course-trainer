# Course Trainer

A Qwik-based web app for interactive certification exam training. Choose a course (e.g., AWS, Azure), generate AI-powered quiz questions, and get instant feedback with explanations.

## Features
- Grouped courses (AWS, Azure, etc.)
- Dynamic quiz generation using HuggingFace LLM API
- Multiple-choice questions with instant feedback
- Explanation for each answer
- Simple, modern UI

## Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:WolfCanCode/course-trainer.git
cd course-trainer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the project root:
```env
PUBLIC_HUGGINGFACE_TOKEN=your_huggingface_api_token_here
```
- Get your HuggingFace API token from https://huggingface.co/settings/tokens

### 4. Run the development server
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production
```bash
npm run build
npm run preview
```

## Usage
1. **Choose a course group and course** from the home page.
2. **Start the quiz** for your selected course.
3. **Answer the AI-generated multiple-choice question.**
4. **Submit your answer** to see if you were correct and read the explanation.

## Project Structure
- `src/routes/index.tsx` — Home page (course selection)
- `src/routes/course/[courseId]/index.tsx` — Course detail page
- `src/routes/course/[courseId]/quiz/index.tsx` — Quiz UI and logic
- `src/routes/course/[courseId]/quiz/get-question.ts` — Server action to fetch questions from HuggingFace

## Environment Variables
- `HUGGINGFACE_TOKEN` — Your HuggingFace API token (required for quiz generation)

## License
MIT
