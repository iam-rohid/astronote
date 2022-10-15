import clsx from "clsx";
import { FC, Fragment, useCallback } from "react";
import { useDrop } from "react-dnd";
import { FiPlus } from "react-icons/fi";
import CreateOrUpdateNotebookDialog from "../../components/CreateOrUpdateNotebookDialog";
import IconButton from "../../components/icon-button";
import SectionTitleBar from "../../components/SectionTitleBar";
import { useDialogs } from "../../contexts/dialogContext";
import useNotebooks from "../../store/useNotebooks";
import { NotebookLink } from "./NotebookLink";

interface NotebooksProps {
  workspaceId: string;
}

const Notebooks: FC<NotebooksProps> = (props) => {
  const { workspaceId } = props;
  const notebooks = useNotebooks((state) =>
    state.notebooks
      .filter((item) => item.workspaceId === workspaceId && !item.parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
  );
  const dialog = useDialogs();
  const handleCreateNotebook = useCallback(() => {
    dialog.showDialog({
      title: "Create Notebook",
      content: (
        <CreateOrUpdateNotebookDialog type="create" workspaceId={workspaceId} />
      ),
    });
  }, [dialog, workspaceId]);

  return (
    <section id="folders" className="my-8">
      <SectionTitleBar title="Notebooks">
        <IconButton size="small" onClick={handleCreateNotebook}>
          <FiPlus />
        </IconButton>
      </SectionTitleBar>

      <nav className="space-y-px px-2">
        <RootDropZone />
        {notebooks.length ? (
          notebooks.map((item) => (
            <Fragment key={item.id}>
              <NotebookLink notebook={item} depth={0} />
              <RootDropZone />
            </Fragment>
          ))
        ) : (
          <div className="px-2">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Use <b>Notebooks</b> to organize <b>Notes</b>
            </p>
          </div>
        )}
      </nav>
    </section>
  );
};

export default Notebooks;

const RootDropZone = () => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["note", "notebook"],
    drop: () => ({
      id: null,
      name: "Unsorted",
    }),
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  }));

  return (
    <div
      className={clsx("relative h-[2px] w-full", {
        "bg-primary-500": isOver,
      })}
    >
      <div ref={drop} className="absolute left-0 right-0 -top-2 h-4"></div>
    </div>
  );
};