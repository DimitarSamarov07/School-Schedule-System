import { ModalShell } from "@/components/ModalShell";
``
export function GradeModal({ manager }: { manager: any }) {
    if (!manager.activeModal) return null;

    if (manager.activeModal === 'delete') {
        return (
            <ModalShell title="Изтриване на клас" onClose={manager.closeModal} maxWidth="sm"
                        footer={<>
                            <button onClick={manager.closeModal} className="flex-1 px-4 py-2 border rounded-lg">Отказ</button>
                            <button onClick={manager.handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Изтрий</button>
                        </>}>
                <p>Сигурни ли сте, че искате да изтриете <strong>{manager.selectedGrade?.Name}</strong>?</p>
            </ModalShell>
        );
    }

    return (
        <ModalShell
            title={manager.activeModal === 'add' ? "Добави Клас" : "Редактирай Клас"}
            onClose={manager.closeModal}
            footer={<button onClick={manager.activeModal === 'add' ? manager.handleCreate : manager.handleUpdate}
                            className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold">Запази</button>}
        >
            <div className="space-y-4">
                <input className="w-full border p-2 rounded-lg" placeholder="Име" value={manager.formData.Name}
                       onChange={e => manager.setFormData({...manager.formData, Name: e.target.value})} />
                <input className="w-full border p-2 rounded-lg" placeholder="Имейл" value={manager.formData.Email}
                       onChange={e => manager.setFormData({...manager.formData, Email: e.target.value})} />
            </div>
        </ModalShell>
    );
}