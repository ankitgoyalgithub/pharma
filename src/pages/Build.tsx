import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Code, 
  Copy,
  Edit,
  Database,
  BarChart3,
  FileText,
  Brain,
  Eye,
  Type
} from 'lucide-react';
import { toast } from "sonner";
import CodeEditor from '@/components/CodeEditor';

const Build = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: '',
    description: '',
    language: 'python'
  });

  const components = [
    {
      id: 1,
      name: 'Data Source',
      description: 'Connect to various data sources and databases',
      language: 'python',
      category: 'Input/Output',
      icon: Database,
      code: `import pandas as pd
import numpy as np

class DataSource:
    def __init__(self, connection_string):
        self.connection = connection_string
        
    def fetch_data(self, query):
        # Implementation for data fetching
        pass
        
    def validate_data(self, data):
        # Data validation logic
        return True`
    },
    {
      id: 2,
      name: 'Analytics Engine',
      description: 'Perform statistical analysis and calculations',
      language: 'python',
      category: 'Processing',
      icon: BarChart3,
      code: `import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error

class AnalyticsEngine:
    def __init__(self):
        self.metrics = {}
        
    def calculate_statistics(self, data):
        # Statistical calculations
        return {
            'mean': np.mean(data),
            'std': np.std(data),
            'variance': np.var(data)
        }
        
    def forecast(self, data, periods=12):
        # Forecasting implementation
        pass`
    },
    {
      id: 3,
      name: 'Report Generator',
      description: 'Generate formatted reports and documentation',
      language: 'python',
      category: 'Output',
      icon: FileText,
      code: `import matplotlib.pyplot as plt
import seaborn as sns
from fpdf import FPDF

class ReportGenerator:
    def __init__(self):
        self.template = "default"
        
    def create_chart(self, data, chart_type="line"):
        # Chart generation logic
        pass
        
    def generate_pdf(self, content):
        # PDF generation
        pdf = FPDF()
        pdf.add_page()
        return pdf`
    },
    {
      id: 4,
      name: 'OCR Agent',
      description: 'Extract text from images and documents',
      language: 'python',
      category: 'AI/ML',
      icon: Eye,
      code: `import cv2
import pytesseract
from PIL import Image

class OCRAgent:
    def __init__(self):
        self.config = r'--oem 3 --psm 6'
        
    def extract_text(self, image_path):
        # Load image
        image = Image.open(image_path)
        
        # Extract text using OCR
        text = pytesseract.image_to_string(image, config=self.config)
        return text.strip()
        
    def process_document(self, document_path):
        # Document processing logic
        pass`
    },
    {
      id: 5,
      name: 'Explainability Agent',
      description: 'Provide explanations for AI model decisions',
      language: 'python',
      category: 'AI/ML',
      icon: Brain,
      code: `import shap
import lime
import pandas as pd

class ExplainabilityAgent:
    def __init__(self, model):
        self.model = model
        self.explainer = None
        
    def explain_prediction(self, instance):
        # Generate explanation for a single prediction
        explanation = self.explainer.explain_instance(instance)
        return explanation
        
    def global_explanation(self, data):
        # Generate global model explanation
        shap_values = self.explainer.shap_values(data)
        return shap_values`
    },
    {
      id: 6,
      name: 'Summarization Agent',
      description: 'Summarize large text documents and data',
      language: 'python',
      category: 'AI/ML',
      icon: Type,
      code: `import transformers
from transformers import pipeline

class SummarizationAgent:
    def __init__(self):
        self.summarizer = pipeline("summarization", 
                                  model="facebook/bart-large-cnn")
        
    def summarize_text(self, text, max_length=130, min_length=30):
        # Text summarization
        summary = self.summarizer(text, 
                                max_length=max_length, 
                                min_length=min_length, 
                                do_sample=False)
        return summary[0]['summary_text']
        
    def summarize_data(self, data):
        # Data summarization logic
        pass`
    }
  ];

  const getBoilerplateCode = (language) => {
    const boilerplates = {
      python: `import pandas as pd
import numpy as np

class CustomComponent:
    def __init__(self):
        """Initialize the component"""
        pass
        
    def process(self, data, prompt=""):
        """
        Process the input data with optional prompt
        
        Args:
            data: Input data to process
            prompt: Optional prompt for guidance
            
        Returns:
            Processed result
        """
        # Your implementation here
        return data
        
    def validate_input(self, data):
        """Validate input data"""
        return True`,
      java: `import java.util.*;

public class CustomComponent {
    
    public CustomComponent() {
        // Initialize the component
    }
    
    public Object process(Object data, String prompt) {
        /*
         * Process the input data with optional prompt
         * 
         * @param data Input data to process
         * @param prompt Optional prompt for guidance
         * @return Processed result
         */
        // Your implementation here
        return data;
    }
    
    public boolean validateInput(Object data) {
        // Validate input data
        return true;
    }
}`,
      scala: `import scala.collection.mutable

class CustomComponent {
  
  def this() {
    // Initialize the component
  }
  
  def process(data: Any, prompt: String = ""): Any = {
    /*
     * Process the input data with optional prompt
     * 
     * @param data Input data to process
     * @param prompt Optional prompt for guidance
     * @return Processed result
     */
    // Your implementation here
    data
  }
  
  def validateInput(data: Any): Boolean = {
    // Validate input data
    true
  }
}`
    };
    return boilerplates[language] || boilerplates.python;
  };

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateComponent = () => {
    if (!newComponent.name.trim()) {
      toast.error("Please enter a component name");
      return;
    }

    const component = {
      id: Date.now(),
      ...newComponent,
      category: 'Custom',
      icon: Code,
      code: getBoilerplateCode(newComponent.language)
    };

    toast.success("Component created successfully");
    setIsCreateDialogOpen(false);
    setNewComponent({ name: '', description: '', language: 'python' });
    setSelectedComponent(component);
    setIsCodeEditorOpen(true);
  };

  const handleOpenCodeEditor = (component) => {
    setSelectedComponent(component);
    setIsCodeEditorOpen(true);
  };

  const handleCloneComponent = (component, e) => {
    e.stopPropagation();
    const clonedComponent = {
      ...component,
      id: Date.now(),
      name: `${component.name} (Copy)`,
    };
    setSelectedComponent(clonedComponent);
    setIsCodeEditorOpen(true);
    toast.success("Component cloned successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Build
              </h1>
              <p className="text-muted-foreground mt-1">Manage and create workflow components</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Component
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Component</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="name">Component Name</Label>
                    <Input
                      id="name"
                      value={newComponent.name}
                      onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter component name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newComponent.description}
                      onChange={(e) => setNewComponent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your component"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select
                      value={newComponent.language}
                      onValueChange={(value) => setNewComponent(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="scala">Scala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateComponent}>
                      Create Component
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <Card 
              key={component.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleOpenCodeEditor(component)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <component.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {component.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {component.language}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {component.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {component.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCodeEditor(component);
                    }}
                  >
                    <Code className="h-3 w-3 mr-1" />
                    Edit Code
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleCloneComponent(component, e)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No components found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first component'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Component
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Code Editor Dialog */}
      {selectedComponent && (
        <CodeEditor
          isOpen={isCodeEditorOpen}
          onClose={() => {
            setIsCodeEditorOpen(false);
            setSelectedComponent(null);
          }}
          component={selectedComponent}
        />
      )}
    </div>
  );
};

export default Build;