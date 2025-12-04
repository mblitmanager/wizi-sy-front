import React from 'react';
import { ChevronRight } from 'lucide-react';

interface LessonBreadcrumbProps {
    courseName: string;
    moduleName: string;
}

export const LessonBreadcrumb: React.FC<LessonBreadcrumbProps> = ({
    courseName,
    moduleName,
}) => {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a
                href="#"
                className="hover:text-gray-900 transition-colors font-medium text-[#00D563]"
            >
                {courseName}
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{moduleName}</span>
        </nav>
    );
};
