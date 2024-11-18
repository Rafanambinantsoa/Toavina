import { useState } from 'react';
import { Drawer, Divider, Text, Table, Button, Select, Menu, Modal, Group } from "@mantine/core";
import { ChevronDown, Mail, Check, X, Trash } from 'lucide-react';
import { Edit } from 'iconsax-react';

import '../../styles/projects/quotes/quotedetails.css'
import { useDisclosure } from '@mantine/hooks';

import EditQuote from './edit-quote/EditQuote';

export default function QuoteDetails({
    opened,
    onClose,
    quote,
    workData,
    taskData,
    budgetData,
    formatQuoteNumber,
    clientName,
}) {
    const [quoteStatus, setQuoteStatus] = useState(quote?.etat_devis || 'en_attente');
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

    // Helper function to calculate budget for a specific task and type
    const calculateTaskBudget = (tache_id, budgetType) => {
        const relevantBudget = budgetData.find(
            budget => budget.tache_id === tache_id &&
                budget.subtype === `budget_${budgetType}` &&
                budget.type === 'previsionnel'
        );

        if (!relevantBudget) return 0;
        return relevantBudget.prix_unitaire * relevantBudget.quantite;
    };

    // Calculate totals for the quote
    const calculateTotals = () => {
        let moTotal = 0;
        let materiauxTotal = 0;
        let materielTotal = 0;
        let sousTraitanceTotal = 0;

        taskData.forEach(task => {
            moTotal += calculateTaskBudget(task.id, 'mo');
            materiauxTotal += calculateTaskBudget(task.id, 'materiaux');
            materielTotal += calculateTaskBudget(task.id, 'materiel');
            sousTraitanceTotal += calculateTaskBudget(task.id, 'sous_traitance');
        });

        return {
            moTotal,
            materiauxTotal,
            materielTotal,
            sousTraitanceTotal,
            total: moTotal + materiauxTotal + materielTotal + sousTraitanceTotal
        };
    };

    const handleEditClick = () => {
        openEdit();
    };

    const getWorkTasks = (ouvrage_id) => {
        return taskData.filter(task => task.ouvrage_id === ouvrage_id);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('fr-FR') + ' €';
    };

    return (
        <>
            <Drawer
                opened={opened}
                onClose={onClose}
                className="popup-modal"
                size={1000}
                position="right"

            >
                <div className="modal-content">
                    <section className="modal-title-section">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '32px'
                            }}
                        >
                            <h1 className="main-title">Devis N° {quote && formatQuoteNumber(quote)}</h1>
                            {quote?.etat_devis != 'valide' &&
                                <Edit size={24} className='custom-action-button'
                                    onClick={handleEditClick}
                                />
                            }
                        </div>
                        <Text className="main-subtitle" c="dimmed" size="sm" mt="12">
                            {clientName} • {quote && new Date(quote.date_creation).toLocaleDateString('fr-FR')} • {quote && quote.etat_devis.charAt(0).toUpperCase() + quote.etat_devis.slice(1).replace('_', ' ')}
                        </Text>
                    </section>
                    <Divider className="divider" />

                    <div className="modal-datainput-content">
                        <div className="modal-form-section" style={{ minWidth: '900px' }}>
                            <Table verticalSpacing="sm" withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className='bold-title'>Ouvrage / Tâche</Table.Th>
                                        <Table.Th className='bold-title'>Main d'oeuvre</Table.Th>
                                        <Table.Th className='bold-title'>Matériaux</Table.Th>
                                        <Table.Th className='bold-title'>Matériel</Table.Th>
                                        <Table.Th className='bold-title'>Sous-traitance</Table.Th>
                                        <Table.Th className='bold-title'>Total</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {workData.map(work => (
                                        <>
                                            <Table.Tr key={work.id} style={{ backgroundColor: '#f8f9fa' }}>
                                                <Table.Td colSpan={6} style={{ fontWeight: 'bold' }} className='bold-title'>
                                                    {work.nom_ouvrage}
                                                </Table.Td>
                                            </Table.Tr>
                                            {getWorkTasks(work.id).map(task => {
                                                const moBudget = calculateTaskBudget(task.id, 'mo');
                                                const materiauxBudget = calculateTaskBudget(task.id, 'materiaux');
                                                const materielBudget = calculateTaskBudget(task.id, 'materiel');
                                                const sousTraitanceBudget = calculateTaskBudget(task.id, 'sous_traitance');
                                                const totalBudget = moBudget + materiauxBudget + materielBudget + sousTraitanceBudget;

                                                return (
                                                    <Table.Tr key={task.id}>
                                                        <Table.Td style={{ paddingLeft: '2rem' }}>{task.nom_tache}</Table.Td>
                                                        <Table.Td>{formatPrice(moBudget)}</Table.Td>
                                                        <Table.Td>{formatPrice(materiauxBudget)}</Table.Td>
                                                        <Table.Td>{formatPrice(materielBudget)}</Table.Td>
                                                        <Table.Td>{formatPrice(sousTraitanceBudget)}</Table.Td>
                                                        <Table.Td>{formatPrice(totalBudget)}</Table.Td>
                                                    </Table.Tr>
                                                );
                                            })}
                                        </>
                                    ))}
                                </Table.Tbody>

                                <Table.Tfoot>
                                    <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                                        <Table.Td style={{ fontWeight: 'bold' }} className='bold-title'>Total</Table.Td>
                                        <Table.Td style={{ fontWeight: 'bold' }} className='bold-title'>{formatPrice(calculateTotals().moTotal)}</Table.Td>
                                        <Table.Td style={{ fontWeight: 'bold' }} className='bold-title'>{formatPrice(calculateTotals().materiauxTotal)}</Table.Td>
                                        <Table.Td style={{ fontWeight: 'bold' }} className='bold-title'>{formatPrice(calculateTotals().materielTotal)}</Table.Td>
                                        <Table.Td style={{ fontWeight: 'bold' }} className='bold-title'>{formatPrice(calculateTotals().sousTraitanceTotal)}</Table.Td>
                                        <Table.Td style={{ fontWeight: 'bold' }} className='bold-title'>{formatPrice(calculateTotals().total)}</Table.Td>
                                    </Table.Tr>
                                </Table.Tfoot>
                            </Table>
                        </div>

                        <div className="modal-action-button" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginTop: '2rem',
                            width: '100%'
                        }}>
                            <Button
                                variant="filled"
                                size="md"
                                className="primary-button"
                                fullWidth
                            >
                                Facturer
                            </Button>

                            {quote?.etat_devis !== 'valide' && <Menu
                                width="100%"
                                shadow='md'
                                position='top'
                                withArrow
                                transitionProps={{ transition: 'slide-up' }}
                            >
                                <Menu.Target>
                                    <Button
                                        variant="outline"
                                        rightSection={<ChevronDown size={14} />}
                                        size="lg"
                                        fullWidth
                                    >
                                        Marquer comme...
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown
                                    style={{
                                        width: 300
                                    }}
                                >
                                    <Menu.Item onClick={() => setQuoteStatus('valide')}>
                                        <div className="quote-status-item">
                                            <Check size={16} />
                                            <Text>Validé</Text>
                                            {/*Change etat_devis to 'valide' and change project phase to 'preparation'*/}
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item onClick={() => setQuoteStatus('refuse')}>
                                        <div className="quote-status-item">
                                            <X size={16} />
                                            <Text>Refusé</Text>
                                        </div>
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>}
                            {quote?.etat_devis == 'valide' &&
                                <Button
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                    onClick={() => setQuoteStatus('en_attente')}
                                >
                                    Annuler
                                </Button>
                            }
                            <Button
                                variant="outline"
                                size="md"
                                leftSection={<Mail size={14} />}
                                fullWidth
                            >
                                Envoyer par e-mail
                            </Button>

                            {quote?.etat_devis != 'valide' &&
                                <Button
                                    variant="outline"
                                    size="md"
                                    leftSection={<Trash size={14} />}
                                    fullWidth
                                    color='red'
                                >
                                    Supprimer
                                </Button>
                            }
                        </div>
                    </div>
                </div>
            </Drawer >
            <EditQuote
                editOpened={editOpened}
                closeEdit={closeEdit}
                quote={quote}
                workData={workData}
                taskData={taskData}
                budgetData={budgetData}
                formatQuoteNumber={formatQuoteNumber}
            />
        </>
    );
}