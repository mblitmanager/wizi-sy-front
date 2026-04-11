import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useAuth';
import { messaging, getToken } from '@/firebase-fcm';
import { api } from '@/services';
import { BookOpen, TrendingUp, User } from 'lucide-react';
import logonsImg from '@/assets/NS.png';
import wiziLogo from '@/assets/logo.png';

const Login = () => {
    const { user, login, isLoading } = useUser();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const token = await login(email, password);
            const tokenAfterLogin = token || localStorage.getItem('token');
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
                    const currentToken = await getToken(messaging, { vapidKey });
                    if (currentToken && tokenAfterLogin) {
                        await api.post(
                            '/fcm-token',
                            { token: currentToken },
                            { headers: { Authorization: `Bearer ${tokenAfterLogin}` } }
                        );
                    }
                }
            } catch (fcmError) {
                /* non bloquant */
            }
        } catch {
            setError('Veuillez vérifier votre email ou mot de passe.');
        }
    };

    if (user || localStorage.getItem('token')) {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
        if (from) return <Navigate to={from} replace />;
        const role = user?.role || user?.user?.role;
        if (role === 'formateur' || role === 'formatrice')
            return <Navigate to="/formateur/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {/* ── Panneau gauche ── */}
                <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-amber-400 to-orange-500 overflow-hidden">
                    {/* cercles décoratifs */}
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-16 w-52 h-52 rounded-full bg-white/8" />

                    {/* Logos */}
                    <div className="relative z-10 flex items-center gap-4">
                        <img src={logonsImg} alt="NS Conseil" className="h-10 w-auto opacity-95" />
                        <img src={wiziLogo} alt="Wizi Learn" className="h-10 w-auto" />
                    </div>

                    {/* Tagline */}
                    <div className="relative z-10">
                        <h2 className="text-white text-2xl font-medium leading-snug mb-3">
                            Développez vos compétences à votre rythme
                        </h2>
                        <p className="text-white/75 text-sm leading-relaxed">
                            Accédez à des centaines de quiz et formations certifiantes pour
                            progresser dans votre carrière.
                        </p>
                    </div>

                    {/* Pills */}
                    <div className="relative z-10 flex flex-col gap-3">
                        {[
                            {
                                icon: <BookOpen className="h-3.5 w-3.5 text-white" />,
                                label: '5 catégories de formations disponibles',
                            },
                            {
                                icon: <TrendingUp className="h-3.5 w-3.5 text-white" />,
                                label: 'Suivez votre progression en temps réel',
                            },
                            {
                                icon: <User className="h-3.5 w-3.5 text-white" />,
                                label: 'Accès personnalisé selon votre formation',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 bg-white/15 border border-white/20 rounded-xl px-4 py-2.5"
                            >
                                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-white/90 text-xs">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Panneau droit ── */}
                <div className="flex flex-col justify-center bg-white px-10 py-12">
                    {/* Logo mobile uniquement */}
                    <div className="flex items-center gap-3 mb-8 md:hidden">
                        <img src={logonsImg} alt="NS Conseil" className="h-9 w-auto" />
                        <img src={wiziLogo} alt="Wizi Learn" className="h-9 w-auto" />
                    </div>

                    <p className="text-xs font-medium tracking-widest uppercase text-amber-500 mb-2">
                        Connexion
                    </p>
                    <h1 className="text-2xl font-medium text-slate-900 mb-1">
                        Bon retour parmi vous
                    </h1>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        Connectez-vous pour accéder à votre espace de formation.
                    </p>

                    {error && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-medium text-slate-600">
                                Adresse email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemple@wizi-learn.com"
                                required
                                autoComplete="email"
                                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 h-11 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-xs font-medium text-slate-600"
                                >
                                    Mot de passe
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-amber-500 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 h-11 text-sm"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5"
                        >
                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        Un problème ?{' '}
                        <a
                            href="mailto:support@wizi-learn.com"
                            className="text-amber-500 hover:underline"
                        >
                            Contactez votre administrateur
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
