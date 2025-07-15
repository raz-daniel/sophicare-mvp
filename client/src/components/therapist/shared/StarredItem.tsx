import { Star, MessageCircle, Lightbulb, Activity, CheckSquare } from 'lucide-react';
import { formatEnumValue } from '../../../utils/stringUtils';
import type { TimelineItem } from '../../../utils/starredItemsExtractor';

interface StarredItemProps {
  item: TimelineItem;
  showTreatmentDate?: boolean;
}

export const StarredItem = ({ item, showTreatmentDate = true }: StarredItemProps) => {
  
  const getItemIcon = (type: TimelineItem['type']) => {
    const iconMap = {
      patientNote: MessageCircle,
      treatmentNote: MessageCircle,
      keyInsight: Lightbulb,
      intervention: Activity,
      homework: CheckSquare
    } as const;
    
    const IconComponent = iconMap[type];
    return <IconComponent size={16} />;
  };

  const getItemTypeLabel = (type: TimelineItem['type']): string => {
    const labelMap = {
      patientNote: 'Patient Note',
      treatmentNote: 'Treatment Note', 
      keyInsight: 'Key Insight',
      intervention: 'Intervention',
      homework: 'Homework'
    } as const;
    
    return labelMap[type];
  };

  const getItemBackgroundColor = (type: TimelineItem['type'], importance: string): string => {
    if (importance === 'highlighted') {
      return 'bg-yellow-50 border-yellow-200';
    }
    
    const colorMap = {
      patientNote: 'bg-blue-50 border-blue-200',
      treatmentNote: 'bg-green-50 border-green-200',
      keyInsight: 'bg-purple-50 border-purple-200',
      intervention: 'bg-orange-50 border-orange-200',
      homework: 'bg-gray-50 border-gray-200'
    } as const;
    
    return colorMap[type];
  };

  const getItemTextColor = (type: TimelineItem['type'], importance: string): string => {
    if (importance === 'highlighted') {
      return 'text-yellow-800';
    }
    
    const colorMap = {
      patientNote: 'text-blue-800',
      treatmentNote: 'text-green-800', 
      keyInsight: 'text-purple-800',
      intervention: 'text-orange-800',
      homework: 'text-gray-800'
    } as const;
    
    return colorMap[type];
  };

  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  const renderItemMetadata = () => {
    if (!item.metadata) return null;
    
    const metadataItems: string[] = [];
    
    if (item.metadata.category) {
      metadataItems.push(formatEnumValue(item.metadata.category));
    }
    
    if (item.metadata.method) {
      metadataItems.push(item.metadata.method);
    }
    
    if (item.metadata.assignedTo) {
      metadataItems.push(`Assigned to: ${formatEnumValue(item.metadata.assignedTo)}`);
    }
    
    if (item.metadata.status) {
      metadataItems.push(`Status: ${formatEnumValue(item.metadata.status)}`);
    }
    
    if (metadataItems.length === 0) return null;
    
    return (
      <div className="text-xs text-gray-500 mt-1">
        {metadataItems.join(' • ')}
      </div>
    );
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getItemBackgroundColor(item.type, item.importance)}`}>
      <div className="flex items-start gap-3">
        {/* Icon and Type */}
        <div className={`flex items-center gap-2 ${getItemTextColor(item.type, item.importance)}`}>
          {getItemIcon(item.type)}
          <span className="text-sm font-medium">
            {getItemTypeLabel(item.type)}
          </span>
          {item.importance === 'highlighted' && (
            <Star size={14} className="text-yellow-500" fill="currentColor" />
          )}
        </div>
        
        {/* Date */}
        <div className="text-xs text-gray-500 ml-auto">
          {showTreatmentDate && (
            <div>Session: {formatDateForDisplay(item.treatmentDate)}</div>
          )}
          <div>Added: {formatDateForDisplay(item.createdAt)}</div>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-3">
        <p className="text-gray-900 leading-relaxed">
          {item.content}
        </p>
        {renderItemMetadata()}
      </div>
    </div>
  );
};