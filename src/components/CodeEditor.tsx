import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Editor from '@monaco-editor/react';
import { 
  Save, 
  Play, 
  Download, 
  Copy,
  Code,
  FileText
} from 'lucide-react';
import { toast } from "sonner";

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  component: {
    id: number;
    name: string;
    description: string;
    language: string;
    category: string;
    code: string;
  };
}

const CodeEditor: React.FC<CodeEditorProps> = ({ isOpen, onClose, component }) => {
  const [code, setCode] = useState(component.code);
  const [isModified, setIsModified] = useState(false);

  // Map component language to Monaco Editor language
  const getMonacoLanguage = (language: string) => {
    const languageMap: { [key: string]: string } = {
      python: 'python',
      java: 'java',
      scala: 'scala',
      javascript: 'javascript',
      typescript: 'typescript',
      sql: 'sql',
      json: 'json'
    };
    return languageMap[language.toLowerCase()] || 'plaintext';
  };

  const handleCodeChange = (newCode: string | undefined) => {
    const codeValue = newCode || '';
    setCode(codeValue);
    setIsModified(codeValue !== component.code);
  };

  const handleSave = () => {
    // In a real implementation, this would save to a backend
    toast.success("Component saved successfully");
    setIsModified(false);
  };

  const handleRun = () => {
    // In a real implementation, this would execute the code
    toast.success("Code execution started");
  };

  const handleDownload = () => {
    const fileExtensions = {
      python: 'py',
      java: 'java',
      scala: 'scala'
    };
    
    const extension = fileExtensions[component.language] || 'txt';
    const filename = `${component.name.toLowerCase().replace(/\s+/g, '_')}.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Code downloaded successfully");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {component.name}
                  {isModified && <span className="text-orange-500 ml-2">●</span>}
                </DialogTitle>
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
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRun}
              >
                <Play className="h-4 w-4 mr-1" />
                Run
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!isModified}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <Separator />
        
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground">Code Editor</h3>
              <div className="text-xs text-muted-foreground">
                Lines: {code.split('\n').length} | Characters: {code.length}
              </div>
            </div>
            <Editor
              height="100%"
              language={getMonacoLanguage(component.language)}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                tabSize: 2,
                insertSpaces: true,
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                }
              }}
              loading={
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Loading editor...
                </div>
              }
            />
          </div>
          
          {/* Documentation Panel */}
          <div className="w-80 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              <h3 className="text-sm font-medium text-foreground">Documentation</h3>
            </div>
            <ScrollArea className="flex-1 border rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Expected Inputs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>data:</strong> Input data to process</li>
                    <li>• <strong>prompt:</strong> Optional prompt for guidance</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Expected Outputs</h4>
                  <p className="text-sm text-muted-foreground">
                    Processed data or result based on the component's functionality
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Usage Notes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ensure input data is properly formatted</li>
                    <li>• Handle errors gracefully</li>
                    <li>• Return consistent output format</li>
                    <li>• Document any dependencies</li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeEditor;