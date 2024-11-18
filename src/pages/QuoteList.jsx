import { useState } from 'react';
import ButtonComponent from '../components/ButtonComponent';
import { Add, More } from 'iconsax-react';
import { SearchIcon } from 'lucide-react';
import '../styles/projects/projectpage.css';
import { Tabs, Text, Table, Badge, Tooltip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates'
import TextInputComponent from '../components/TextInput';
import FilterComponent from '../components/FilterComponent';
import { useData } from '../context/DataProvider';
import { Calendar } from 'iconsax-react';

import noResultFound from '../assets/images/no_results.webp';

import QuoteDetails from './quotes/QuoteDetails';
import AddQuote from './quotes/AddQuote';

export default function QuoteList({ project }) {
    const { quoteData = [], workData = [], taskData = [], clientData = [], budgetData = [] } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [addQuoteOpened, setAddQuoteOpened] = useState(false);

    // Add sorting state
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const getClientName = (client_id) => {
        const client = clientData.find(client => client.id === client_id);
        return client ? client.nom_client : 'Client inconnu';
    };

    const filterQuotesByProject = (quotes) => {
        return quotes.filter(quote => quote.projet_id === project.id);
    };

    const filterQuotesByDate = (quotes) => {
        if (!dateRange[0] || !dateRange[1]) return quotes;

        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        return quotes.filter(quote => {
            const quoteDate = new Date(quote.date_creation);
            return quoteDate >= startDate && quoteDate <= endDate;
        });
    };

    // Add sorting function
    const sortQuotes = (quotes) => {
        if (!sortConfig.key) return quotes;

        return [...quotes].sort((a, b) => {
            let aValue, bValue;

            switch (sortConfig.key) {
                case 'number':
                    aValue = formatQuoteNumber(a);
                    bValue = formatQuoteNumber(b);
                    break;
                case 'project':
                    aValue = project.nom_projet;
                    bValue = project.nom_projet;
                    break;
                case 'amount':
                    aValue = calculateQuoteTotal(a.id);
                    bValue = calculateQuoteTotal(b.id);
                    break;
                case 'client':
                    aValue = getClientName(project.client_id);
                    bValue = getClientName(project.client_id);
                    break;
                case 'date':
                    aValue = new Date(a.date_creation);
                    bValue = new Date(b.date_creation);
                    break;
                case 'status':
                    aValue = a.etat_devis;
                    bValue = b.etat_devis;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Add sort handler
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Add sort indicator styles
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
        }
        return '';
    };

    const calculateQuoteTotal = (devis_id) => {
        const quoteWorks = workData.filter(work => work.devis_id === devis_id);
        return quoteWorks.reduce((total, work) => {
            const workTasks = taskData.filter(task => task.ouvrage_id === work.id);
            const workTotal = workTasks.reduce((taskTotal, task) => {
                const taskBudgets = budgetData.filter(budget =>
                    budget.tache_id === task.id &&
                    budget.type === 'previsionnel'
                );

                const taskSum = taskBudgets.reduce((sum, budget) =>
                    sum + (budget.prix_unitaire * budget.quantite), 0);

                return taskTotal + taskSum;
            }, 0);
            return total + workTotal;
        }, 0);
    };

    const formatQuoteNumber = (quote) => {
        const date = new Date(quote.date_creation);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `D${year}${month}${day}${quote.id}`;
    };

    const StatusBadge = ({ status }) => {
        const colorMap = {
            valide: 'green',
            refuse: 'red',
            en_attente: 'yellow'
        };

        return (
            <Badge color={colorMap[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </Badge>
        );
    };

    const QuoteTable = ({ quotes }) => {
        const projectQuotes = filterQuotesByProject(quotes);
        const filteredQuotes = filterQuotesByDate(projectQuotes);
        const sortedQuotes = sortQuotes(filteredQuotes);

        // Add cursor pointer style for sortable headers
        const sortableHeaderStyle = {
            cursor: 'pointer',
            userSelect: 'none'
        };

        return (
            <Table.ScrollContainer>
                <Table verticalSpacing="md" withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th
                                className='bold-title'
                                style={sortableHeaderStyle}
                                onClick={() => requestSort('number')}
                            >
                                Numéro{getSortIndicator('number')}
                            </Table.Th>
                            <Table.Th
                                className='bold-title'
                                style={sortableHeaderStyle}
                                onClick={() => requestSort('project')}
                            >
                                Projet{getSortIndicator('project')}
                            </Table.Th>
                            <Table.Th
                                className='bold-title'
                                style={sortableHeaderStyle}
                                onClick={() => requestSort('amount')}
                            >
                                Montant{getSortIndicator('amount')}
                            </Table.Th>
                            <Table.Th
                                className='bold-title'
                                style={sortableHeaderStyle}
                                onClick={() => requestSort('client')}
                            >
                                Client{getSortIndicator('client')}
                            </Table.Th>
                            <Table.Th
                                className='bold-title'
                                style={sortableHeaderStyle}
                                onClick={() => requestSort('date')}
                            >
                                Date de création{getSortIndicator('date')}
                            </Table.Th>
                            <Table.Th
                                className='bold-title'
                                style={sortableHeaderStyle}
                                onClick={() => requestSort('status')}
                            >
                                État{getSortIndicator('status')}
                            </Table.Th>
                            <Table.Th className='bold-title'>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sortedQuotes.length > 0 ? (
                            sortedQuotes.map(quote => (
                                <Table.Tr key={quote.id}>
                                    <Table.Td>{formatQuoteNumber(quote)}</Table.Td>
                                    <Table.Td>{project.nom_projet}</Table.Td>
                                    <Table.Td>{calculateQuoteTotal(quote.id).toLocaleString('fr-FR')} €</Table.Td>
                                    <Table.Td>{getClientName(project.client_id)}</Table.Td>
                                    <Table.Td>{new Date(quote.date_creation).toLocaleDateString('fr-FR')}</Table.Td>
                                    <Table.Td><StatusBadge status={quote.etat_devis} /></Table.Td>
                                    <Table.Td>
                                        <div className="table-action-buttons">
                                            <More
                                                size="24"
                                                className='table-action-button-item'
                                                onClick={() => {
                                                    setSelectedQuote(quote);
                                                    setDrawerOpened(true);
                                                }}
                                            />
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                                    <img src={noResultFound} alt="No quotes found" style={{ maxWidth: '200px' }} />
                                    <Text>Aucun devis trouvé</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        );
    };

    const hasValidatedQuote = () => {
        const projectQuotes = filterQuotesByProject(quoteData);
        return projectQuotes.some(quote => quote.etat_devis === 'valide');
    };

    // Get relevant budget data for the selected quote
    const getQuoteBudgetData = (devis_id) => {
        const quoteWorks = workData.filter(work => work.devis_id === devis_id);
        const quoteTasks = taskData.filter(task =>
            quoteWorks.map(work => work.id).includes(task.ouvrage_id)
        );
        return budgetData.filter(budget =>
            quoteTasks.map(task => task.id).includes(budget.tache_id)
        );
    };

    return (
        <>
            <section className="main-title-cta">
                <div
                    className="main-title-section"
                    style={{
                        padding: 0,
                        marginBottom: 24
                    }}>
                    <h1 className="main-title">Devis</h1>
                    <Text className="main-subtitle" c="dimmed">Liste de devis pour le projet: {project.nom_projet}</Text>
                </div>
                <div className="add-quote-section">
                    <Tooltip
                        label="Un devis validé existe déjà pour ce projet"
                        position="bottom"
                        disabled={!hasValidatedQuote()}
                    >
                        <div>
                            <ButtonComponent
                                fieldname={'Ajouter un devis'}
                                rightIcon={<Add size={24} />}
                                onClick={() => setAddQuoteOpened(true)}
                            // disabled={hasValidatedQuote()}
                            />
                        </div>
                    </Tooltip>
                </div>
            </section>
            <section className="project-phase-content">
                <div className="projects-filter-section">
                    {/* <TextInputComponent
                        fieldname="Rechercher"
                        rightIcon={<SearchIcon size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    /> */}

                    <DatePickerInput
                        leftSection={<Calendar size={16} />}
                        dropdownType="modal"
                        type="range"
                        radius='xl'
                        placeholder="Sélectionner une période"
                        value={dateRange}
                        onChange={setDateRange}
                        locale="fr"
                        clearable
                        style={{
                            width: '400px'
                        }}
                    />
                </div>
                <Tabs defaultValue="tous">
                    <Tabs.List>
                        <Tabs.Tab value="tous">Tous</Tabs.Tab>
                        <Tabs.Tab value="valide">Validés</Tabs.Tab>
                        <Tabs.Tab value="refuse">Refusés</Tabs.Tab>
                        <Tabs.Tab value="en_attente">En attente</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="tous">
                        <QuoteTable quotes={quoteData} />
                    </Tabs.Panel>

                    <Tabs.Panel value="valide">
                        <QuoteTable quotes={quoteData.filter(quote => quote.etat_devis === 'valide')} />
                    </Tabs.Panel>

                    <Tabs.Panel value="refuse">
                        <QuoteTable quotes={quoteData.filter(quote => quote.etat_devis === 'refuse')} />
                    </Tabs.Panel>

                    <Tabs.Panel value="en_attente">
                        <QuoteTable quotes={quoteData.filter(quote => quote.etat_devis === 'en_attente')} />
                    </Tabs.Panel>
                </Tabs>
            </section>
            <QuoteDetails
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                quote={selectedQuote}
                formatQuoteNumber={formatQuoteNumber}
                clientName={getClientName(project.client_id)}
                workData={workData.filter(work => work.devis_id === selectedQuote?.id)}
                taskData={taskData.filter(task =>
                    workData
                        .filter(work => work.devis_id === selectedQuote?.id)
                        .map(work => work.id)
                        .includes(task.ouvrage_id)
                )}
                budgetData={selectedQuote ? getQuoteBudgetData(selectedQuote.id) : []}
            />
            {/* <AddQuote
                opened={addQuoteOpened}
                onClose={() => setAddQuoteOpened(false)}
            /> */}
            <AddQuote
                addOpened={addQuoteOpened}
                closeAdd={() => setAddQuoteOpened(false)}
                projet_id={project.id}
                hasValidatedQuote={hasValidatedQuote}
            />
        </>
    );
}