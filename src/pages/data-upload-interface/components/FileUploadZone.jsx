import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    const csvFiles = files?.filter(file => file?.type === 'text/csv' || file?.name?.endsWith('.csv'));
    if (csvFiles?.length > 0) {
      onFileSelect(csvFiles?.[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-muted hover:border-primary/50 hover:bg-muted/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Upload" size={32} color="var(--color-primary)" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Uploading File...</h3>
              <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Icon name="Upload" size={32} color="var(--color-muted-foreground)" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Crime Dataset</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Button variant="outline" onClick={handleBrowseClick}>
                <Icon name="FolderOpen" size={16} className="mr-2" />
                Browse Files
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={16} color="var(--color-success)" />
          <span className="text-muted-foreground">Format: CSV files only</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="HardDrive" size={16} color="var(--color-success)" />
          <span className="text-muted-foreground">Max size: 100MB</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="text-muted-foreground">Secure upload</span>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;