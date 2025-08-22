'use client';

import { useEffect, useState } from 'react';
import { IpcBodyInterface, IpcKey, IPCResponseInterface } from 'shared';
import { formatIOSTimeToString } from '../../helpers';
import { clsx } from '../../helpers/clsx';
import { useIPCKey } from '../../hooks';
import emitter from '../../utils/event-bus';

export const Footer = () => {
	const [task, setTask] = useState<IpcBodyInterface['Run_File'][]>([]);
	const [results, setResults] = useState<
		{
			job_id: string;
			results: IPCResponseInterface['Run_File'][];
			status: IPCResponseInterface['Run_File']['status'];
			fileNane: string;
			url: string;
		}[]
	>([]);
	const [active, setActive] = useState<string>('');
	const [activeTab, setActiveTab] = useState<'running' | 'error' | 'complete' | 'close'>('close');
	const [log, setLog] = useState<IPCResponseInterface['Run_File'][]>([]);
	const resultsRes = useIPCKey(IpcKey.RunFile);

	useEffect(() => {
		function getNewTask(data: IpcBodyInterface['Run_File']) {
			setTask(prev => {
				if (prev.length === 0) {
					setActiveTab('running');
				}
				return [...prev, data];
			});
			setActive(data.job_id);
		}
		emitter.on('sendNewTask', getNewTask);

		return () => {
			emitter.off('sendNewTask', getNewTask);
		};
	}, []);

	useEffect(() => {
		if (resultsRes) {
			setResults(prev => {
				const checkTask = prev.find(item => item.job_id === resultsRes.job_id);
				if (checkTask) {
					return prev.map(item => {
						if (item.job_id === resultsRes.job_id) {
							return { ...item, results: [...item.results, resultsRes], status: resultsRes.status };
						}
						return item;
					});
				}
				return [
					...prev,
					{
						job_id: resultsRes.job_id,
						results: [resultsRes],
						status: resultsRes.status,
						fileNane: resultsRes.fileName,
						url: resultsRes.url
					}
				];
			});
		}
	}, [resultsRes]);

	useEffect(() => {
		setLog(results.find(item => item.job_id === active)?.results || []);
	}, [results, active]);
	const runningCount = results.filter(item => item.status === 'running').length;
	const errorCount = results.filter(item => item.status === 'error').length;
	const completeCount = results.filter(item => item.status === 'success').length;

	return (
		<div className={`relative h-8 w-full border-t border-gray-200 bg-white ${task.length === 0 ? 'h-0' : 'h-8'}`}>
			<div className="flex h-8 items-center px-3">
				<div
					onClick={() => setActiveTab('running')}
					className="flex h-8 cursor-pointer items-center gap-1 px-2 hover:bg-gray-100"
				>
					<div>Running:</div>
					<div>{runningCount}</div>
				</div>
				<div
					onClick={() => setActiveTab('error')}
					className="flex h-8 cursor-pointer items-center gap-1 px-2 hover:bg-gray-100"
				>
					<div>Error:</div>
					<div>{errorCount}</div>
				</div>
				<div
					onClick={() => setActiveTab('complete')}
					className="flex h-8 cursor-pointer items-center gap-1 px-2 hover:bg-gray-100"
				>
					<div>Complete:</div>
					<div>{completeCount}</div>
				</div>
			</div>
			<div
				className={`absolute bottom-full left-0 right-0 grid max-h-72 min-h-72 grid-cols-[auto_1fr] border-y border-gray-200 bg-white ${activeTab === 'close' ? 'hidden' : ''}`}
			>
				<div className="grid h-72 w-[300px] grid-rows-[1fr] border-r border-gray-200">
					<div className="overflow-y-auto">
						<div className="flex w-full flex-col gap-[2px]">
							{results.map(item => {
								return (
									<div
										key={`file-tab-${item.job_id}`}
										onClick={() => setActive(item.job_id)}
										className={`flex h-8 cursor-pointer items-center rounded px-2 hover:bg-gray-50 ${item.job_id === active ? 'bg-gray-100' : ''} ${item.status === 'error' ? 'text-red-600' : ''} ${item.status === 'success' ? 'text-green-600' : ''} ${item.status === 'running' ? 'text-cyan-600' : ''}`}
									>
										<div className="line-clamp-1 break-all text-sm">
											{item.results[0].fileName} ({item.results[0]?.url})
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="grid h-72 grid-rows-[1fr] border-r border-gray-200">
					<div className="overflow-y-auto">
						<div className="flex w-full flex-col gap-[2px]">
							{log.map((item, index) => {
								return (
									<div
										key={`log-${item.job_id}-${index}`}
										className="flex min-h-8 cursor-pointer items-center rounded px-2 hover:bg-gray-50"
									>
										<div
											className={clsx(
												'flex flex-col text-sm',
												item.status === 'success' ? 'text-green-500' : '',
												item.status === 'error' ? 'text-red-500' : ''
											)}
										>
											{item.status === 'running' && (
												<div className="flex items-center gap-1">
													<div className="hover:text-blue-500 hover:underline">[{item.data?.line}]</div>
													<div>{item.data?.desscription}</div>
												</div>
											)}
											{item.status === 'error' && (
												<div className="flex flex-wrap items-center gap-1">
													<div className="hover:text-blue-500 hover:underline">[{item.data?.line}]</div>
													<div>{item.message}</div>
													<div className="w-full">{formatIOSTimeToString(item.data?.time || '')}</div>
												</div>
											)}
											{item.status === 'success' && (
												<div className="flex flex-wrap items-center gap-1">
													<div className="hover:text-blue-500 hover:underline">[{item.data?.line}]</div>
													<div>{item.data?.desscription}</div>
													<div className="w-full">{formatIOSTimeToString(item.data?.time || '')}</div>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
