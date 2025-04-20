import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Upload, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';



export default function Page() {

    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [idType, setIdType] = useState('');
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFiles(Array.from(e.target.files));
      }
    };
  
    const simulateUpload = () => {
      if (files.length === 0) {
        setUploadStatus('error');
        return;
      }
  
      setUploadStatus('uploading');
      setUploadProgress(0);
  
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStatus('success');
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    };


  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              
              <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-green-800 dark:text-green-200">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/demo" className="text-green-800 dark:text-green-200">Onbaording</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            </div>
            <div className="flex-1" />

            <div className="ml-auto mr-4">
              <ModeToggle />
            </div>
          </header>

          <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Identity Verification</CardTitle>
          <CardDescription>
            Please upload a clear image of your identification document
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload ID</TabsTrigger>
              <TabsTrigger value="details">Personal Details</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="id-type">ID Document Type</Label>
                  <Select value={idType} onValueChange={setIdType}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers-license">Driver's License</SelectItem>
                      <SelectItem value="national-id">National ID Card</SelectItem>
                      <SelectItem value="residence-permit">Residence Permit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id-file">Upload Document Image</Label>
                  
                  <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => document.getElementById('id-file')?.click()}>
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-10 w-10 text-gray-400" />
                      <div className="text-sm font-medium">
                        {files.length > 0 ? (
                          <span className="text-blue-600">{files.map(f => f.name).join(', ')}</span>
                        ) : (
                          <span>
                            <span className="text-blue-600 font-semibold">Click to upload</span> or drag and drop
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG or PDF (max. 10MB)
                      </div>
                    </div>
                    <Input 
                      id="id-file" 
                      type="file" 
                      accept="image/png,image/jpeg,application/pdf" 
                      className="hidden" 
                      onChange={handleFileChange}
                      multiple={false}
                    />
                  </div>

                  {uploadStatus === 'uploading' && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {uploadStatus === 'success' && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle>Upload Successful</AlertTitle>
                      <AlertDescription>
                        Your identification document has been uploaded successfully.
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadStatus === 'error' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Please select a file to upload.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Photo Requirements</Label>
                  <ul className="text-sm space-y-1 text-gray-600 list-disc pl-5">
                    <li>Make sure the entire document is visible</li>
                    <li>All text should be clearly readable</li>
                    <li>No glare or shadows on the document</li>
                    <li>Document must be valid and not expired</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Enter your last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-number">ID Number</Label>
                <Input id="id-number" placeholder="Enter the number on your ID document" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input id="expiry-date" type="date" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <Separator />
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={simulateUpload} className="bg-green-900 text-white hover:bg-green-800">Submit Verification</Button>
        </CardFooter>
      </Card>
    </div>

         
      
          
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
