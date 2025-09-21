import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useTaskStore } from '@/stores/taskStore';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { uploadService } from '@/lib/api';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  totalRows?: number;
  validRows?: number;
  invalidRows?: number;
  assignments?: any[];
  errors?: ValidationError[];
}

export function BulkImportTasks() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addTask, refreshTasks } = useTaskStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setImportResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Upload file to backend API
      const result = await uploadService.uploadFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      setImportResult(result);

      if (result.success) {
        toast.success(result.message || 'File uploaded successfully!');
        // Refresh tasks to show newly imported ones
        await refreshTasks();
        // Close the import dialog after successful upload
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        toast.error(result.message || 'Upload failed. Please check your file format.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setImportResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['title', 'description', 'issueDate', 'dueDate', 'subject', 'completed'],
      ['Complete project proposal', 'Write a detailed project proposal document', '2024-01-15', '2024-02-15', 'Software Development', 'false'],
      ['Review code changes', 'Review and approve pending pull requests', '2024-01-20', '2024-01-25', 'Software Development', 'false']
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Bulk Import Tasks
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Bulk Import Tasks
        </CardTitle>
        <CardDescription>
          Upload a CSV or Excel file to import multiple tasks at once. 
          <Button
            variant="link"
            size="sm"
            onClick={downloadTemplate}
            className="p-0 h-auto ml-1"
          >
            Download template
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Choose File'}
          </Button>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Import Results */}
        {importResult && (
          <div className="space-y-4">
            {/* Success/Error Message */}
            <Alert className={importResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {importResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={importResult.success ? "text-green-800" : "text-red-800"}>
                {importResult.message}
              </AlertDescription>
            </Alert>

            {/* Summary Stats */}
            {importResult.totalRows !== undefined && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{importResult.totalRows}</div>
                  <div className="text-sm text-gray-500">Total Rows</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResult.validRows || 0}</div>
                  <div className="text-sm text-green-500">Valid Tasks</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResult.invalidRows || 0}</div>
                  <div className="text-sm text-red-500">Invalid Rows</div>
                </div>
              </div>
            )}

            {/* Detailed Errors */}
            {importResult.errors && importResult.errors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="font-semibold text-red-800">Validation Errors:</div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-4 border-red-300">
                          <div className="font-medium text-red-800">
                            {error.field === 'header' ? 'Column Issue' : `Row ${error.row}`}
                          </div>
                          <div className="text-red-700">{error.message}</div>
                          {error.value && (
                            <div className="text-red-600 text-xs mt-1">
                              Found: <code className="bg-red-100 px-1 rounded">{error.value}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-red-700 bg-red-100 p-3 rounded">
                      <strong>Required columns:</strong> title, issueDate, dueDate, subject<br/>
                      <strong>Optional columns:</strong> description, completed
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
