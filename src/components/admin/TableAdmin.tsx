import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Copy, Eye } from "lucide-react";
import { useState } from "react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableAdminProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onDuplicate?: (row: any) => void;
  onView?: (row: any) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const TableAdmin = ({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: TableAdminProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(data.map((row) => row.id)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </TableHead>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-8">
                  <p className="text-gray-500">Aucune donnée</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedRows);
                        if (e.target.checked) {
                          newSelected.add(row.id);
                        } else {
                          newSelected.delete(row.id);
                        }
                        setSelectedRows(newSelected);
                      }}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={`${row.id}-${col.key}`}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right space-x-2 flex justify-end">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(row)}
                        title="Voir">
                        <Eye size={16} />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(row)}
                        title="Éditer">
                        <Edit size={16} />
                      </Button>
                    )}
                    {onDuplicate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(row)}
                        title="Dupliquer">
                        <Copy size={16} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(row)}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}>
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
