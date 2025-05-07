
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin"
];

const frameworks = [
  { id: "react", label: "React" },
  { id: "angular", label: "Angular" },
  { id: "vue", label: "Vue.js" },
  { id: "next", label: "Next.js" },
  { id: "express", label: "Express" },
  { id: "django", label: "Django" },
  { id: "flask", label: "Flask" },
  { id: "spring", label: "Spring Boot" },
  { id: "laravel", label: "Laravel" },
  { id: "rails", label: "Ruby on Rails" }
];

const securityMeasures = [
  { id: "sql-injection", label: "SQL Injection Prevention" },
  { id: "xss", label: "Cross-Site Scripting (XSS) Protection" },
  { id: "csrf", label: "CSRF Protection" },
  { id: "input-validation", label: "Input Validation" },
  { id: "authentication", label: "Authentication Best Practices" },
  { id: "authorization", label: "Authorization Controls" },
  { id: "data-encryption", label: "Data Encryption" },
  { id: "secure-headers", label: "Security Headers" },
  { id: "rate-limiting", label: "Rate Limiting" },
  { id: "logging", label: "Security Logging and Monitoring" }
];

type QuestionnaireValues = {
  projectGoal: string;
  specificFeatures: string;
  programmingLanguage: string;
  frameworks: string[];
  securityRequirements: string[];
  codeStructure: string;
  restrictions: string;
};

const PromptGenerator = () => {
  const [activeTab, setActiveTab] = useState("objective");
  const [promptGenerated, setPromptGenerated] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const form = useForm<QuestionnaireValues>({
    defaultValues: {
      projectGoal: "",
      specificFeatures: "",
      programmingLanguage: "",
      frameworks: [],
      securityRequirements: [],
      codeStructure: "",
      restrictions: ""
    }
  });
  
  const onSubmit = (data: QuestionnaireValues) => {
    console.log("Form data:", data);
    
    // Generate prompt based on form data
    const prompt = generatePrompt(data);
    setGeneratedPrompt(prompt);
    setPromptGenerated(true);
    
    // In a real implementation, this could send the prompt to an API
    console.log("Generated prompt:", prompt);
  };
  
  const generatePrompt = (data: QuestionnaireValues) => {
    // Create a structured prompt based on the data
    let prompt = `I need you to help me create code for the following project:\n\n`;
    
    // Objective
    prompt += `# Project Objective:\n${data.projectGoal}\n\n`;
    
    // Features
    prompt += `# Specific Features Required:\n${data.specificFeatures}\n\n`;
    
    // Technical Requirements
    prompt += `# Technical Requirements:\n`;
    prompt += `- Programming Language: ${data.programmingLanguage}\n`;
    
    if (data.frameworks && data.frameworks.length > 0) {
      prompt += `- Frameworks/Libraries: ${data.frameworks.join(", ")}\n`;
    }
    
    // Security Requirements
    if (data.securityRequirements && data.securityRequirements.length > 0) {
      prompt += `\n# Security Requirements:\n`;
      data.securityRequirements.forEach(req => {
        prompt += `- ${req}\n`;
      });
    }
    
    // Code Structure
    if (data.codeStructure) {
      prompt += `\n# Code Structure Preferences:\n${data.codeStructure}\n`;
    }
    
    // Restrictions
    if (data.restrictions) {
      prompt += `\n# Restrictions or Exclusions:\n${data.restrictions}\n`;
    }
    
    prompt += `\nPlease provide well-structured, clean code that follows best practices for the specified language and frameworks. Include comments to explain complex logic and provide proper error handling.`;
    
    return prompt;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      alert("Prompt copied to clipboard!");
    });
  };
  
  const nextTab = () => {
    if (activeTab === "objective") setActiveTab("technical");
    else if (activeTab === "technical") setActiveTab("security");
    else if (activeTab === "security") setActiveTab("structure");
    else if (activeTab === "structure") {
      form.handleSubmit(onSubmit)();
    }
  };
  
  const prevTab = () => {
    if (activeTab === "technical") setActiveTab("objective");
    else if (activeTab === "security") setActiveTab("technical");
    else if (activeTab === "structure") setActiveTab("security");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Prompt Generator</h1>
          <p className="text-gray-600 text-center mb-8">
            Create optimized prompts for AI-assisted software development.
          </p>
          
          {!promptGenerated ? (
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <div className="mb-6">
                        <TabsList className="grid grid-cols-4 w-full">
                          <TabsTrigger value="objective">Project Objective</TabsTrigger>
                          <TabsTrigger value="technical">Technical Specs</TabsTrigger>
                          <TabsTrigger value="security">Security</TabsTrigger>
                          <TabsTrigger value="structure">Structure & Limits</TabsTrigger>
                        </TabsList>
                      </div>
                    
                      {/* Project Objective Tab */}
                      <TabsContent value="objective" className="space-y-6">
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="projectGoal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>What are you trying to build?</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe your project goal in detail. For example: I'm building a user authentication system with login, registration, and password reset."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Be specific about what you're trying to achieve.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="specificFeatures"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>What specific features do you need?</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List the specific features you need. For example: Form validation, email verification, CAPTCHA integration."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enumerate each feature you want the code to include.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Next: Technical Specs
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Technical Specifications Tab */}
                      <TabsContent value="technical" className="space-y-6">
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="programmingLanguage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Programming Language</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a language" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {languages.map(lang => (
                                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Choose the main programming language for your project.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="frameworks"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Frameworks & Libraries</FormLabel>
                                  <FormDescription>
                                    Select all frameworks and libraries you want to use.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  {frameworks.map((framework) => (
                                    <FormField
                                      key={framework.id}
                                      control={form.control}
                                      name="frameworks"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={framework.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(framework.label)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, framework.label])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== framework.label
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {framework.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Previous
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Next: Security
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Security Tab */}
                      <TabsContent value="security" className="space-y-6">
                        <FormField
                          control={form.control}
                          name="securityRequirements"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Security Requirements</FormLabel>
                                <FormDescription>
                                  Select all security measures that should be implemented.
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {securityMeasures.map((measure) => (
                                  <FormField
                                    key={measure.id}
                                    control={form.control}
                                    name="securityRequirements"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={measure.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(measure.label)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, measure.label])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== measure.label
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {measure.label}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Previous
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Next: Structure & Limits
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Structure & Limits Tab */}
                      <TabsContent value="structure" className="space-y-6">
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="codeStructure"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Code Structure Preferences</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe how you want the code organized. For example: Using MVC pattern, with separate folders for models, controllers, and views."
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Specify your preferences for code organization, commenting style, etc.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="restrictions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Restrictions or Exclusions</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List any technologies, patterns, or approaches you want to avoid. For example: Do not use jQuery, avoid global variables."
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Specify what you do NOT want included in the solution.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Previous
                          </Button>
                          <Button type="submit" className="bg-brand-600">
                            Generate Prompt
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Generated Prompt</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedPrompt}
                  </pre>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={copyToClipboard} className="flex-1">
                    Copy to Clipboard
                  </Button>
                  <Button 
                    onClick={() => setPromptGenerated(false)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Edit Prompt
                  </Button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Coming Soon: Direct AI Integration</h3>
                  <p className="text-gray-600 mb-4">
                    In the full version, you'll be able to send this prompt directly to your preferred AI model and view the results here.
                  </p>
                  <div className="bg-gray-100 border border-gray-200 rounded-md p-4">
                    <div className="flex items-center space-x-4 mb-4 opacity-50">
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose AI Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt35">OpenAI GPT-3.5</SelectItem>
                          <SelectItem value="gpt4">OpenAI GPT-4</SelectItem>
                          <SelectItem value="gemini">Google Gemini</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button disabled>Execute Prompt</Button>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      This feature will be available in the released version.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PromptGenerator;
