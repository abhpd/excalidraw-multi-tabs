import { useSortable } from '@dnd-kit/react/sortable';
import clsx from 'clsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAppStore } from '../../store';
import type { ITab } from '../../types';
import { GripIcon, TrashIcon } from '../icons';
import styles from './style.module.css';

interface TabProps {
  tab: ITab;
  index: number;
}

interface FormData {
  title: string;
}

const Tab = ({ tab, index }: TabProps) => {
  const { currentTabId, setCurrentTabId, updateTab, deleteTab } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { title: tab.title },
  });

  const { ref, handleRef, isDragging } = useSortable({
    id: tab.id,
    index,
    group: 'tabs',
    disabled: isEditing,
  });

  const isActive = currentTabId === tab.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (tab.elements.length === 0) {
      deleteTab(tab.id);
      return;
    }

    const isConfirmed = confirm('Are you sure you want to delete this tab?');
    if (!isConfirmed) return;
    deleteTab(tab.id);
  };

  const handleTitleClick = () => {
    if (!isActive) return;
    setIsEditing(true);
    reset({ title: tab.title });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    reset({ title: tab.title });
  };

  const onSubmit = (data: FormData) => {
    const trimmedTitle = data.title.trim();
    if (trimmedTitle && trimmedTitle !== tab.title) {
      const newTab = { ...tab, title: trimmedTitle };
      updateTab(tab.id, newTab);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({ title: tab.title });
  };

  return (
    <div
      ref={ref}
      className={clsx(styles.tab, {
        [styles.active]: isActive,
        [styles.dragging]: isDragging,
      })}
      onClick={() => setCurrentTabId(tab.id)}
    >
      <button
        ref={handleRef}
        type="button"
        className={styles.dragHandle}
        title="Drag to reorder tab"
        aria-label="Drag to reorder tab"
      >
        <GripIcon />
      </button>

      {!isEditing && (
        <span
          className={clsx(styles.title, { [styles.active]: isActive })}
          onClick={handleTitleClick}
          onDoubleClick={handleDoubleClick}
          title={tab.title}
        >
          {tab.title}
        </span>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
          <input
            {...register('title')}
            className={styles.titleInput}
            type="text"
            autoFocus
            onBlur={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
              }
            }}
          />
        </form>
      )}
      {isActive && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
          title="Delete tab"
          aria-label="Delete tab"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default Tab;

